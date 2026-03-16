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
    // Clear any persisted data from the previous test so this test
    // starts with an empty cache (prevents stale mutations from leaking).
    localStorage.removeItem('appwrite-graphql-offline-cache')

    const offlineClient = createOfflineClient({
      endpoint: config.endpoint,
      projectId: config.projectId,
      networkAdapter: {
        listen: mock(),
      },
      storage: localStorage,
      throttleTime: 0, // Disable throttling for testing
    })

    const { appwrite, queryClient } = offlineClient

    queryClient.setDefaultOptions({
      mutations: { networkMode: 'online' },
    })

    // Use a wrapper WITHOUT the persister to avoid each renderHook call
    // creating a new PersistQueryClientProvider that re-restores from
    // localStorage and duplicates mutations.
    const wrapper = createWrapper({ client: appwrite, queryClient })

    // Start persistence imperatively (single restore point)
    const { unsubscribe: unsubscribePersister } = offlineClient.startPersistence()

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

    const offlineCache = localStorage.getItem('appwrite-graphql-offline-cache')
    expect(offlineCache).toBeTruthy()

    const parsedCache = JSON.parse(offlineCache!)
    const mutationKeys = parsedCache.clientState.mutations.map((m: { mutationKey: string[] }) =>
      m.mutationKey.join('.'),
    )
    expect(mutationKeys).toContain(Keys.databases().collections().documents().create().join('.'))
    expect(mutationKeys).toContain(Keys.databases().collections().documents().update().join('.'))

    // Unsubscribe the persister FIRST (so clearing doesn't overwrite localStorage),
    // then tear down the queryClient so its paused mutations' retryers don't
    // resume when onlineManager goes online in the next test.
    unsubscribePersister()
    queryClient.unmount()

    // Replace each paused mutation's mutationFn with a no-op so that when the
    // retryer's internal onlineManager subscription fires later, the zombie
    // mutations complete harmlessly instead of making real HTTP requests.
    for (const m of queryClient.getMutationCache().getAll()) {
      m.setOptions({ ...m.options, mutationFn: () => Promise.resolve(undefined) as any })
    }
    queryClient.getMutationCache().clear()
  })

  test(
    'mutations are replayed when app restarts',
    async () => {
      onlineManager.setOnline(true)

      const offlineClient = createOfflineClient({
        endpoint: config.endpoint,
        projectId: config.projectId,
        networkAdapter: {
          listen: mock(),
        },
        storage: localStorage,
      })

      const { appwrite, queryClient } = offlineClient

      // Clear stale session from previous test so we can create a fresh one
      if (typeof globalThis.localStorage !== 'undefined') {
        globalThis.localStorage.removeItem('cookieFallback')
      }

      await appwrite.account.createEmailPasswordSession({
        email: userEmail,
        password: userPassword,
      })

      // Restore persisted cache and kick off mutation replay before rendering
      const { restored } = offlineClient.startPersistence()
      await restored

      // Wait for replayed mutations to fully settle
      await waitFor(
        () => {
          const mutations = queryClient.getMutationCache().getAll()
          const unfinished = mutations.filter(
            (m) => m.state.status === 'pending' || m.state.isPaused,
          )
          expect(unfinished.length).toBe(0)
        },
        { timeout: 12_000 },
      )

      // Now query the document — no persister on the wrapper since
      // persistence is already handled imperatively above.
      const wrapper = createWrapper({ client: appwrite, queryClient })

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

      await waitFor(() => expect(getResult.current.data).toBeTruthy(), { timeout: 6_000 })
      expect(getResult.current.data?.name).toBe('Test Document')
      expect(getResult.current.data?.age).toBe(26)

      createdDocumentIds.push(documentCreatedOfflineId)
    },
    { timeout: 20_000 },
  )

  test('conflict resolution: server-wins strategy', async () => {
    // This test covers the conflict-aware update mutation function registered in the registry.
    // It simulates a conflict scenario and verifies that the "server wins" (remote) wins.

    const offlineClient = createOfflineClient({
      endpoint: config.endpoint,
      projectId: config.projectId,
      networkAdapter: {
        listen: mock(),
      },
      storage: localStorage,
      conflictStrategy: 'server-wins',
      throttleTime: 0, // Disable throttling for testing
    })

    const { appwrite, queryClient } = offlineClient

    const options = queryClient.getDefaultOptions()
    queryClient.setDefaultOptions({
      ...options,
      mutations: {
        ...options.mutations,
        networkMode: 'online',
      },
    })

    const wrapper = createWrapper({ client: appwrite, queryClient })

    await loginUser(userEmail, userPassword, wrapper)

    // Create a document online to have a base snapshot
    const documentId = ID.unique()

    const { result: createResult } = renderHook(() => useCreateDocument(), { wrapper })

    act(() => {
      createResult.current.mutate({
        databaseId,
        collectionId,
        documentId,
        data: { name: 'Original Name', age: 20 },
      })
    })

    await waitFor(() => expect(createResult.current.isSuccess).toBe(true))

    createdDocumentIds.push(documentId)

    // Start an update mutation while offline
    onlineManager.setOnline(false)

    const { result: updateResult } = renderHook(() => useUpdateDocument(), { wrapper })

    await act(async () => {
      updateResult.current.mutate({
        databaseId,
        collectionId,
        documentId,
        data: { name: 'Offline Update', age: 21 },
      })
    })

    await waitFor(() => expect(updateResult.current.isPaused).toBe(true))

    // Simulate a remote update that happens while we're offline
    await appwrite.tablesDB.updateRow({
      databaseId,
      tableId: collectionId,
      rowId: documentId,
      data: {
        name: 'Remote Update',
        age: 22,
      },
    })

    await new Promise((r) => setTimeout(r, 50)) // Wait for the remote update to be registered

    // Go back online and trigger the conflict resolution
    act(() => {
      onlineManager.setOnline(true)
    })

    await waitFor(() => expect(updateResult.current.isSuccess).toBe(true))

    // Fetch the document to verify the final state
    const { result: getResult } = renderHook(
      () =>
        useDocument<{
          name: string
          age: number
        }>({
          databaseId,
          collectionId,
          documentId,
        }),
      { wrapper },
    )

    await waitFor(() => expect(getResult.current.data).toBeTruthy())

    // With "server-wins", the remote update should win over the offline update
    expect(getResult.current.data?.name).toBe('Remote Update')
    expect(getResult.current.data?.age).toBe(22)
  })

  test('conflict resolution: last-write-wins strategy', async () => {
    // This test covers the conflict-aware update mutation function registered in the registry.
    // It simulates a conflict scenario and verifies that the "last write" (any) wins.

    const offlineClient = createOfflineClient({
      endpoint: config.endpoint,
      projectId: config.projectId,
      networkAdapter: {
        listen: mock(),
      },
      storage: localStorage,
      conflictStrategy: 'last-write-wins',
      throttleTime: 0, // Disable throttling for testing
    })

    const { appwrite, queryClient } = offlineClient

    const options = queryClient.getDefaultOptions()
    queryClient.setDefaultOptions({
      ...options,
      mutations: {
        ...options.mutations,
        networkMode: 'online',
      },
    })

    const wrapper = createWrapper({ client: appwrite, queryClient })

    await loginUser(userEmail, userPassword, wrapper)

    // Create a document online to have a base snapshot
    const documentId = ID.unique()

    const { result: createResult } = renderHook(() => useCreateDocument(), { wrapper })

    act(() => {
      createResult.current.mutate({
        databaseId,
        collectionId,
        documentId,
        data: { name: 'Original Name', age: 20 },
      })
    })

    await waitFor(() => expect(createResult.current.isSuccess).toBe(true))

    createdDocumentIds.push(documentId)

    // Start an update mutation while offline
    onlineManager.setOnline(false)

    const { result: updateResult } = renderHook(() => useUpdateDocument(), { wrapper })

    await act(async () => {
      updateResult.current.mutate({
        databaseId,
        collectionId,
        documentId,
        data: { name: 'Offline Update', age: 21 },
      })
    })

    await waitFor(() => expect(updateResult.current.isPaused).toBe(true))

    // Simulate a remote update that happens while we're offline
    await appwrite.tablesDB.updateRow({
      databaseId,
      tableId: collectionId,
      rowId: documentId,
      data: {
        name: 'Remote Update',
        age: 22,
      },
    })

    await new Promise((r) => setTimeout(r, 50)) // Wait for the remote update to be registered

    // Go back online and trigger the conflict resolution
    act(() => {
      onlineManager.setOnline(true)
    })

    await waitFor(() => expect(updateResult.current.isSuccess).toBe(true))

    // Fetch the document to verify the final state
    const { result: getResult } = renderHook(
      () =>
        useDocument<{
          name: string
          age: number
        }>({
          databaseId,
          collectionId,
          documentId,
        }),
      { wrapper },
    )

    await waitFor(() => expect(getResult.current.data).toBeTruthy())

    // With "last-write-wins", the last update (offline or remote) should win
    expect(getResult.current.data?.name).toBe('Offline Update')
    expect(getResult.current.data?.age).toBe(21)
  })

  test('conflict resolution: merge-shallow strategy', async () => {
    // This test covers the conflict-aware update mutation function registered in the registry.

    const offlineClient = createOfflineClient({
      endpoint: config.endpoint,
      projectId: config.projectId,
      networkAdapter: {
        listen: mock(),
      },
      storage: localStorage,
      conflictStrategy: 'merge-shallow',
      throttleTime: 0, // Disable throttling for testing
    })

    const { appwrite, queryClient } = offlineClient

    const options = queryClient.getDefaultOptions()
    queryClient.setDefaultOptions({
      ...options,
      mutations: {
        ...options.mutations,
        networkMode: 'online',
      },
    })

    const wrapper = createWrapper({ client: appwrite, queryClient })

    await loginUser(userEmail, userPassword, wrapper)

    // Create a document online to have a base snapshot
    const documentId = ID.unique()

    const { result: createResult } = renderHook(() => useCreateDocument(), { wrapper })

    act(() => {
      createResult.current.mutate({
        databaseId,
        collectionId,
        documentId,
        data: { name: 'Original Name', age: 20 },
      })
    })

    await waitFor(() => expect(createResult.current.isSuccess).toBe(true))

    createdDocumentIds.push(documentId)

    // Start an update mutation while offline
    onlineManager.setOnline(false)

    const { result: updateResult } = renderHook(() => useUpdateDocument(), { wrapper })

    await act(async () => {
      updateResult.current.mutate({
        databaseId,
        collectionId,
        documentId,
        data: { name: 'Offline Update' },
      })
    })

    await waitFor(() => expect(updateResult.current.isPaused).toBe(true))

    // Simulate a remote update that happens while we're offline
    await appwrite.tablesDB.updateRow({
      databaseId,
      tableId: collectionId,
      rowId: documentId,
      data: {
        age: 22,
      },
    })

    await new Promise((r) => setTimeout(r, 50)) // Wait for the remote update to be registered

    // Go back online and trigger the conflict resolution
    act(() => {
      onlineManager.setOnline(true)
    })

    await waitFor(() => expect(updateResult.current.isSuccess).toBe(true))

    // Fetch the document to verify the final state
    const { result: getResult } = renderHook(
      () =>
        useDocument<{
          name: string
          age: number
        }>({
          databaseId,
          collectionId,
          documentId,
        }),
      { wrapper },
    )

    await waitFor(() => expect(getResult.current.data).toBeTruthy())

    // With "merge-shallow", the local changes should be merged with the remote changes
    expect(getResult.current.data?.name).toBe('Offline Update')
    expect(getResult.current.data?.age).toBe(22)
  })
})
