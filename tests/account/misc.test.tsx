import { describe, test, expect, beforeAll, afterAll } from 'bun:test'
import { renderHook, act, waitFor } from '@testing-library/react'

import { createWrapper, createQueryClient } from '../setup/wrapper'
import { createTestUser, deleteTestUser } from '../setup/helpers'
import {
  useLogin,
  useListIdentities,
  useLogs,
} from '../../src'

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

describe('Account misc hooks', () => {
  let user: Awaited<ReturnType<typeof createTestUser>>

  beforeAll(async () => {
    user = await createTestUser()
  })

  afterAll(async () => {
    await deleteTestUser(user.userId)
  })

  test('useListIdentities returns identities after login', async () => {
    const queryClient = createQueryClient()
    const wrapper = createWrapper({ queryClient })

    await loginUser(user.email, user.password, wrapper)

    const { result } = renderHook(() => useListIdentities(), { wrapper })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data).toBeDefined()
  })

  test('useLogs returns activity logs after login', async () => {
    const queryClient = createQueryClient()
    const wrapper = createWrapper({ queryClient })

    await loginUser(user.email, user.password, wrapper)

    const { result } = renderHook(() => useLogs({ queries: [] }), { wrapper })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data).toBeDefined()
    expect(result.current.data?.logs).toBeDefined()
    expect(Array.isArray(result.current.data?.logs)).toBe(true)
  })

  test.skip('useCreateOAuth2Token requires OAuth provider configuration', () => {})
  test.skip('useCreateEmailToken requires email delivery', () => {})
  test.skip('useCreateMagicURLToken requires email delivery', () => {})
  test.skip('useCreatePhoneToken requires SMS provider', () => {})
  test.skip('useCreatePhoneVerification requires SMS provider', () => {})
  test.skip('useUpdatePhoneVerification requires SMS provider', () => {})
  test.skip('useUpdatePhoneSession requires SMS provider', () => {})
  test.skip('useUpdateMagicURLSession requires email delivery', () => {})
  test.skip('usePasswordRecovery requires email delivery', () => {})
  test.skip('useResetPassword requires email delivery and recovery token', () => {})
  test.skip('useVerification requires email delivery', () => {})
  test.skip('useCreatePushTarget requires messaging provider', () => {})
  test.skip('useUpdatePushTarget requires messaging provider', () => {})
  test.skip('useDeletePushTarget requires messaging provider', () => {})
  test.skip('useDeleteIdentity requires identity from OAuth provider', () => {})
  test.skip('useUpdateStatus destructive: disables account', () => {})
})
