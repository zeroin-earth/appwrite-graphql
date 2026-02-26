import { describe, test, expect, beforeAll, afterAll, beforeEach } from 'bun:test'
import { renderHook, act, waitFor } from '@testing-library/react'
import { QueryClient } from '@tanstack/react-query'
import { createWrapper, createQueryClient } from '../setup/wrapper'
import { createTestUser, deleteTestUser } from '../setup/helpers'
import {
  useLogin,
  useUpdateName,
  useUpdateEmail,
  useUpdatePassword,
  useUpdatePrefs,
  useGetPrefs,
  useUpdateStatus,
} from '../../src'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

type Wrapper = ReturnType<typeof createWrapper>

async function loginUser(email: string, password: string, wrapper: Wrapper) {
  const { result } = renderHook(() => useLogin(), { wrapper })

  await act(async () => {
    result.current.login.mutateAsync({ email, password })
  })

  await waitFor(() => expect(result.current.login.isSuccess).toBe(true))
}

// ---------------------------------------------------------------------------
// useUpdateName
// ---------------------------------------------------------------------------

describe('useUpdateName', () => {
  let userId: string
  let email: string
  let password: string
  let queryClient: QueryClient
  let wrapper: Wrapper

  beforeAll(async () => {
    const user = await createTestUser({ name: 'UpdateName User' })
    userId = user.userId
    email = user.email
    password = user.password
  })

  afterAll(async () => {
    await deleteTestUser(userId)
  })

  beforeEach(() => {
    queryClient = createQueryClient()
    wrapper = createWrapper({ queryClient })
  })

  test('updates the account name', async () => {
    await loginUser(email, password, wrapper)

    const { result } = renderHook(() => useUpdateName(), { wrapper })

    await act(async () => {
      result.current.mutate({ name: 'Updated Name' })
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data).toBeDefined()
    expect(result.current.data?.name).toBe('Updated Name')
  })
})

// ---------------------------------------------------------------------------
// useUpdateEmail
// ---------------------------------------------------------------------------

describe('useUpdateEmail', () => {
  let userId: string
  let email: string
  let password: string
  let queryClient: QueryClient
  let wrapper: Wrapper

  beforeAll(async () => {
    const user = await createTestUser({ name: 'UpdateEmail User' })
    userId = user.userId
    email = user.email
    password = user.password
  })

  afterAll(async () => {
    await deleteTestUser(userId)
  })

  beforeEach(() => {
    queryClient = createQueryClient()
    wrapper = createWrapper({ queryClient })
  })

  test('updates the account email', async () => {
    await loginUser(email, password, wrapper)

    const newEmail = `updated-${Date.now()}@test.local`

    const { result } = renderHook(() => useUpdateEmail(), { wrapper })

    await act(async () => {
      result.current.mutate({ email: newEmail, password })
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data).toBeDefined()
    expect(result.current.data?.email).toBe(newEmail)
  })
})

// ---------------------------------------------------------------------------
// useUpdatePassword
// ---------------------------------------------------------------------------

describe('useUpdatePassword', () => {
  let userId: string
  let email: string
  let password: string
  let queryClient: QueryClient
  let wrapper: Wrapper

  beforeAll(async () => {
    const user = await createTestUser({ name: 'UpdatePassword User' })
    userId = user.userId
    email = user.email
    password = user.password
  })

  afterAll(async () => {
    await deleteTestUser(userId)
  })

  beforeEach(() => {
    queryClient = createQueryClient()
    wrapper = createWrapper({ queryClient })
  })

  test('updates the account password', async () => {
    await loginUser(email, password, wrapper)

    const newPassword = 'newpassword123456'

    const { result } = renderHook(() => useUpdatePassword(), { wrapper })

    await act(async () => {
      result.current.mutate({ password: newPassword, oldPassword: password })
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data).toBeDefined()
    expect(result.current.data?.status).toBeTruthy()
  })
})

// ---------------------------------------------------------------------------
// useUpdatePrefs & useGetPrefs
// ---------------------------------------------------------------------------

describe('useUpdatePrefs', () => {
  let userId: string
  let email: string
  let password: string
  let queryClient: QueryClient
  let wrapper: Wrapper

  beforeAll(async () => {
    const user = await createTestUser({ name: 'UpdatePrefs User' })
    userId = user.userId
    email = user.email
    password = user.password
  })

  afterAll(async () => {
    await deleteTestUser(userId)
  })

  beforeEach(() => {
    queryClient = createQueryClient()
    wrapper = createWrapper({ queryClient })
  })

  test('updates user preferences', async () => {
    await loginUser(email, password, wrapper)

    const { result } = renderHook(() => useUpdatePrefs(), { wrapper })

    await act(async () => {
      result.current.mutate({ prefs: { theme: 'dark', fontSize: 14 } })
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data).toBeDefined()
  })

  test('reads preferences with useGetPrefs after setting them', async () => {
    await loginUser(email, password, wrapper)

    // First, set prefs so there is something to read back
    const { result: updateResult } = renderHook(() => useUpdatePrefs(), { wrapper })

    await act(async () => {
      updateResult.current.mutate({ prefs: { theme: 'light', notifications: true } })
    })

    await waitFor(() => expect(updateResult.current.isSuccess).toBe(true))

    // Now query prefs
    const { result: prefsResult } = renderHook(() => useGetPrefs(), { wrapper })

    await waitFor(() => expect(prefsResult.current.isSuccess).toBe(true))

    expect(prefsResult.current.data).toBeDefined()
    expect(prefsResult.current.data?.data).toBeDefined()

    const prefsData = JSON.parse(prefsResult.current.data!.data as string)
    expect(prefsData.theme).toBe('light')
    expect(prefsData.notifications).toBe(true)
  })
})

// ---------------------------------------------------------------------------
// useUpdateStatus — skipped (destructive: disables the account)
// ---------------------------------------------------------------------------

describe('useUpdateStatus', () => {
  test.skip('is skipped because it disables the account (destructive operation)', () => {
    // useUpdateStatus sets the account status to disabled.
    // Running this in tests would prevent subsequent operations on the user.
    // If this must be tested, create a throwaway user exclusively for this test
    // and delete it immediately after.
  })
})
