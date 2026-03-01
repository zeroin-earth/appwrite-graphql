import type { QueryClient } from '@tanstack/react-query'
import { act, renderHook, waitFor } from '@testing-library/react'
import { afterAll, beforeAll, beforeEach, describe, expect, test } from 'bun:test'

import {
  useGetPrefs,
  useUpdateEmail,
  useUpdateName,
  useUpdatePassword,
  useUpdatePrefs,
} from '../../src'
import { createTestUser, deleteTestUser, loginUser } from '../setup/helpers'
import { createQueryClient, createWrapper } from '../setup/wrapper'

type Wrapper = ReturnType<typeof createWrapper>

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
      await result.current.mutateAsync({ name: 'Updated Name' })
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data).toBeDefined()
    expect(result.current.data?.name).toBe('Updated Name')
  })
})

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
      await result.current.mutateAsync({ email: newEmail, password })
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data).toBeDefined()
    expect(result.current.data?.email).toBe(newEmail)
  })
})

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
      await result.current.mutateAsync({ password: newPassword, oldPassword: password })
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data).toBeDefined()
    expect(result.current.data?.status).toBeTruthy()
  })
})

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
      await result.current.mutateAsync({ prefs: { theme: 'dark', fontSize: 14 } })
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data).toBeDefined()
  })

  test('reads preferences with useGetPrefs after setting them', async () => {
    await loginUser(email, password, wrapper)

    // First, set prefs so there is something to read back
    const { result: updateResult } = renderHook(() => useUpdatePrefs(), { wrapper })

    await act(async () => {
      await updateResult.current.mutateAsync({ prefs: { theme: 'light', notifications: true } })
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

describe('useUpdateStatus', () => {
  test.skip('is skipped because it disables the account (destructive operation)', () => {
    // useUpdateStatus sets the account status to disabled.
    // Running this in tests would prevent subsequent operations on the user.
    // If this must be tested, create a throwaway user exclusively for this test
    // and delete it immediately after.
  })
})
