import { onlineManager } from '@tanstack/react-query'
import { act, renderHook, waitFor } from '@testing-library/react'
import { afterAll, beforeAll, describe, expect, mock, test } from 'bun:test'
export type { AsyncStorage } from '@tanstack/query-persist-client-core'

import {
  createOfflineClient,
  Keys,
  useCreateDocument,
  useDocument,
  useUpdateDocument,
} from '../../src'
import { ID } from '../../src/types'
import {
  createTestUser,
  deleteTestDocument,
  deleteTestUser,
  getTestConfig,
  loginUser,
} from '../setup/helpers'
import { createWrapper } from '../setup/wrapper'

describe('Mutation Registry', () => {
  const config = getTestConfig()
  const { databaseId, collectionId } = config
  let userId: string
  let userEmail: string
  let userPassword: string
  const createdDocumentIds: string[] = []

  let documentCreatedOfflineId: string

  beforeAll(async () => {
    const user = await createTestUser({ name: 'Doc CRUD User' })
    userId = user.userId
    userEmail = user.email
    userPassword = user.password
  })

  afterAll(async () => {
    for (const docId of createdDocumentIds) {
      await deleteTestDocument(docId)
    }
    await deleteTestUser(userId)
  })

  test('databasesCreateDocument mutation queues mutation when offline and executes when back online', async () => {
    const { appwrite, queryClient, persister } = createOfflineClient({
      endpoint: config.endpoint,
      projectId: config.projectId,
      networkAdapter: {
        listen: mock(),
      },
      storage: localStorage,
    })

    queryClient.setDefaultOptions({
      mutations: { networkMode: 'online' },
    })

    const wrapper = createWrapper({
      client: appwrite,
      queryClient,
      persister,
    })

    await loginUser(userEmail, userPassword, wrapper)
    onlineManager.setOnline(false)

    const { result: createResult } = renderHook(() => useCreateDocument(), { wrapper })

    const documentId = ID.unique()

    await act(async () => {
      createResult.current.mutate({
        databaseId,
        collectionId,
        documentId,
        data: { name: 'Test Document', age: 25 },
      })
    })

    await waitFor(() => expect(createResult.current.isPaused).toBe(true))

    act(() => {
      onlineManager.setOnline(true)
    })

    await waitFor(() => expect(createResult.current.isSuccess).toBe(true))

    createdDocumentIds.push(documentId)
  })

  test('mutations save to localStorage when offline', async () => {
    const { appwrite, queryClient, persister } = createOfflineClient({
      endpoint: config.endpoint,
      projectId: config.projectId,
      networkAdapter: {
        listen: mock(),
      },
      storage: localStorage,
      throttleTime: 0, // Disable throttling for testing
    })

    queryClient.setDefaultOptions({
      mutations: { networkMode: 'online' },
    })

    const wrapper = createWrapper({
      client: appwrite,
      queryClient,
      persister,
    })

    await loginUser(userEmail, userPassword, wrapper)
    onlineManager.setOnline(false)

    const { result: createResult } = renderHook(() => useCreateDocument(), { wrapper })

    const documentId = ID.unique()
    documentCreatedOfflineId = documentId

    await act(async () => {
      createResult.current.mutate({
        databaseId,
        collectionId,
        documentId,
        data: { name: 'Test Document', age: 25 },
      })
    })

    await waitFor(() => expect(createResult.current.isPaused).toBe(true))

    const { result: updateResult } = renderHook(() => useUpdateDocument(), { wrapper })

    await act(async () => {
      updateResult.current.mutate({
        databaseId,
        collectionId,
        documentId,
        data: { age: 26 },
      })
    })

    await waitFor(() => expect(updateResult.current.isPaused).toBe(true))
    await new Promise((r) => setTimeout(r, 50)) // Wait for localStorage to update

    const offlineCache = localStorage.getItem('appwrite-graphql-offline-cache') // For debugging: check the persisted mutations
    expect(offlineCache).toBeTruthy()

    const parsedCache = JSON.parse(offlineCache!)
    const mutationKeys = parsedCache.clientState.mutations.map((m: { mutationKey: string[] }) =>
      m.mutationKey.join('.'),
    )
    expect(mutationKeys).toContain(Keys.databases().collections().documents().create().join('.'))
    expect(mutationKeys).toContain(Keys.databases().collections().documents().update().join('.'))
  })

  test(
    'mutations are replayed when app restarts',
    async () => {
      onlineManager.setOnline(true)

      const { appwrite, queryClient, persister } = createOfflineClient({
        endpoint: config.endpoint,
        projectId: config.projectId,
        networkAdapter: {
          listen: mock(),
        },
        storage: localStorage,
      })

      const wrapper = createWrapper({
        client: appwrite,
        queryClient,
        persister,
      })

      await appwrite.account.createEmailPasswordSession({
        email: userEmail,
        password: userPassword,
      })

      const { result: getResult } = renderHook(
        () =>
          useDocument<{
            name: string
            age: number
          }>({
            databaseId,
            collectionId,
            documentId: documentCreatedOfflineId,
          }),
        { wrapper },
      )

      // Wait for the document to exist (create mutation replayed)
      await waitFor(() => expect(getResult.current.data).toBeTruthy(), { timeout: 12_000 })
      expect(getResult.current.data?.name).toBe('Test Document')

      // Wait for all persisted mutations to finish replaying (including the update)
      await waitFor(
        () => {
          const pending = queryClient
            .getMutationCache()
            .getAll()
            .filter((m) => m.state.status === 'pending' || m.state.isPaused)
          expect(pending.length).toBe(0)
        },
        { timeout: 10_000 },
      )

      // Refetch after mutations complete — replayed mutations lack onSuccess invalidation
      await act(async () => {
        await queryClient.refetchQueries()
      })

      await waitFor(() => expect(getResult.current.data?.age).toBe(26), { timeout: 6_000 })

      createdDocumentIds.push(documentCreatedOfflineId)
    },
    { timeout: 20_000 },
  )
})
