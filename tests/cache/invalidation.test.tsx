import { describe, test, expect, beforeAll, afterAll } from 'bun:test'
import { renderHook, act, waitFor } from '@testing-library/react'

import { createWrapper, createQueryClient } from '../setup/wrapper'
import {
  createTestUser,
  deleteTestUser,
  createTestDocument,
  getTestConfig,
} from '../setup/helpers'
import {
  useAccount,
  useLogin,
  useLogout,
  useUpdateName,
  useUpdatePrefs,
  useCollection,
  useCreateDocument,
  useDeleteDocument,
  getFragmentData,
  fragments,
} from '../../src'
import { ID } from '../../src/types'

async function loginUser(
  email: string,
  password: string,
  wrapper: ReturnType<typeof createWrapper>,
) {
  const { result } = renderHook(() => useLogin(), { wrapper })
  await act(async () => {
    result.current.login.mutateAsync({ email, password })
  })
  await waitFor(() => expect(result.current.login.isSuccess).toBe(true))
}

describe('Cache invalidation', () => {
  let user: Awaited<ReturnType<typeof createTestUser>>

  beforeAll(async () => {
    user = await createTestUser()
  })

  afterAll(async () => {
    await deleteTestUser(user.userId)
  })

  test('account name change invalidates account query', async () => {
    const queryClient = createQueryClient()
    const wrapper = createWrapper({ queryClient })

    await loginUser(user.email, user.password, wrapper)

    const { result: accountResult } = renderHook(() => useAccount(), { wrapper })

    await waitFor(() => expect(accountResult.current.isSuccess).toBe(true))

    const originalAccount = getFragmentData(
      fragments.Account_UserFragment,
      accountResult.current.data,
    )
    const originalName = originalAccount?.name

    const newName = `Updated ${Date.now()}`
    const { result: updateNameResult } = renderHook(() => useUpdateName(), { wrapper })

    await act(async () => {
      await updateNameResult.current.mutateAsync({ name: newName })
    })

    await waitFor(() => {
      const account = getFragmentData(
        fragments.Account_UserFragment,
        accountResult.current.data,
      )
      expect(account?.name).toBe(newName)
    })

    const updatedAccount = getFragmentData(
      fragments.Account_UserFragment,
      accountResult.current.data,
    )
    expect(updatedAccount?.name).not.toBe(originalName)
  })

  test('account prefs change invalidates account query', async () => {
    const queryClient = createQueryClient()
    const wrapper = createWrapper({ queryClient })

    await loginUser(user.email, user.password, wrapper)

    const { result: accountResult } = renderHook(() => useAccount(), { wrapper })

    await waitFor(() => expect(accountResult.current.isSuccess).toBe(true))

    const newPrefs = { theme: `dark-${Date.now()}` }
    const { result: updatePrefsResult } = renderHook(() => useUpdatePrefs(), { wrapper })

    await act(async () => {
      await updatePrefsResult.current.mutateAsync({ prefs: newPrefs })
    })

    await waitFor(() => {
      const account = getFragmentData(
        fragments.Account_UserFragment,
        accountResult.current.data,
      )
      expect(account?.prefs).toBeDefined()
    })
  })

  test('document create invalidates collection query', async () => {
    const queryClient = createQueryClient()
    const wrapper = createWrapper({ queryClient })
    const config = getTestConfig()

    await loginUser(user.email, user.password, wrapper)

    const { result: collectionResult } = renderHook(
      () =>
        useCollection({
          databaseId: config.databaseId,
          collectionId: config.collectionId,
          queries: [],
        }),
      { wrapper },
    )

    await waitFor(() => expect(collectionResult.current.isSuccess).toBe(true))

    const initialTotal = collectionResult.current.total ?? 0

    const { result: createDocResult } = renderHook(() => useCreateDocument(), { wrapper })

    await act(async () => {
      await createDocResult.current.mutateAsync({
        databaseId: config.databaseId,
        collectionId: config.collectionId,
        documentId: ID.unique(),
        data: { name: 'cache-test', age: 1, active: true },
      })
    })

    await waitFor(() => {
      expect(collectionResult.current.total).toBe(initialTotal + 1)
    })
  })

  test('document delete invalidates collection query', async () => {
    const queryClient = createQueryClient()
    const wrapper = createWrapper({ queryClient })
    const config = getTestConfig()

    const doc = await createTestDocument({ name: 'to-delete', age: 99, active: false })

    await loginUser(user.email, user.password, wrapper)

    const { result: collectionResult } = renderHook(
      () =>
        useCollection({
          databaseId: config.databaseId,
          collectionId: config.collectionId,
          queries: [],
        }),
      { wrapper },
    )

    await waitFor(() => expect(collectionResult.current.isSuccess).toBe(true))

    const initialTotal = collectionResult.current.total ?? 0

    const { result: deleteDocResult } = renderHook(() => useDeleteDocument(), { wrapper })

    await act(async () => {
      await deleteDocResult.current.mutateAsync({
        databaseId: config.databaseId,
        collectionId: config.collectionId,
        documentId: doc.$id,
      })
    })

    await waitFor(() => {
      expect(collectionResult.current.total).toBe(initialTotal - 1)
    })
  })

  test('login invalidates account query', async () => {
    const queryClient = createQueryClient()
    const wrapper = createWrapper({ queryClient })

    const freshUser = await createTestUser()

    try {
      await loginUser(freshUser.email, freshUser.password, wrapper)

      const { result: accountResult } = renderHook(() => useAccount(), { wrapper })

      await waitFor(() => expect(accountResult.current.isSuccess).toBe(true))

      expect(accountResult.current.data).toBeDefined()
      const account = getFragmentData(
        fragments.Account_UserFragment,
        accountResult.current.data,
      )
      expect(account?.email).toBe(freshUser.email)
    } finally {
      await deleteTestUser(freshUser.userId)
    }
  })

  test('logout clears all queries', async () => {
    const queryClient = createQueryClient()
    const wrapper = createWrapper({ queryClient })

    await loginUser(user.email, user.password, wrapper)

    const { result: accountResult } = renderHook(() => useAccount(), { wrapper })

    await waitFor(() => expect(accountResult.current.isSuccess).toBe(true))
    expect(accountResult.current.data).toBeDefined()

    const { result: logoutResult } = renderHook(() => useLogout(), { wrapper })

    await act(async () => {
      await logoutResult.current.mutateAsync({ sessionId: 'current' })
    })

    await waitFor(() => {
      const queries = queryClient.getQueryCache().getAll()
      const activeQueries = queries.filter((q) => q.state.data !== undefined)
      expect(activeQueries.length).toBe(0)
    })
  })
})
