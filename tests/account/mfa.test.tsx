import type { QueryClient } from '@tanstack/react-query'
import { act, renderHook, waitFor } from '@testing-library/react'
import { afterAll, beforeAll, describe, expect, test } from 'bun:test'

import {
  AuthenticatorType,
  useCreateMfaAuthenticator,
  useCreateMfaRecoveryCodes,
  useListMfaFactors,
  useUpdateMfa,
  useUpdateMfaAuthenticator,
} from '../../src'
import { createTestUser, deleteTestUser, generateTOTP, loginUser } from '../setup/helpers'
import { createQueryClient, createWrapper } from '../setup/wrapper'

type Wrapper = ReturnType<typeof createWrapper>

describe('MFA (Multi-Factor Authentication)', () => {
  let userId: string
  let email: string
  let password: string
  let queryClient: QueryClient
  let wrapper: Wrapper

  /** TOTP secret returned when creating the authenticator. */
  let totpSecret: string

  beforeAll(async () => {
    const user = await createTestUser({ name: 'MFA Test User' })
    userId = user.userId
    email = user.email
    password = user.password

    queryClient = createQueryClient()
    wrapper = createWrapper({ queryClient })

    await loginUser(email, password, wrapper)
  })

  afterAll(async () => {
    try {
      // Attempt to disable MFA in case a test failed mid-flow
      const { result: mfaResult } = renderHook(() => useUpdateMfa(), {
        wrapper,
      })
      await act(async () => {
        await mfaResult.current.mutateAsync({ mfa: false })
      })
      await waitFor(() => expect(mfaResult.current.isSuccess).toBe(true))
    } catch {
      // MFA may already be disabled – ignore
    }

    await deleteTestUser(userId)
  })

  test('useUpdateMfa – enables MFA on the account', async () => {
    const { result } = renderHook(() => useUpdateMfa(), { wrapper })

    await act(async () => {
      await result.current.mutateAsync({ mfa: true })
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data).toBeDefined()
    expect(result.current.data?.mfa).toBe(true)
  })

  test('useCreateMfaAuthenticator – creates a TOTP authenticator', async () => {
    const { result } = renderHook(() => useCreateMfaAuthenticator(), {
      wrapper,
    })

    await act(async () => {
      await result.current.mutateAsync({ type: AuthenticatorType.Totp })
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data).toBeDefined()
    expect(result.current.data?.secret).toBeDefined()
    expect(result.current.data?.uri).toBeDefined()
    expect(typeof result.current.data?.secret).toBe('string')
    expect(typeof result.current.data?.uri).toBe('string')

    // Persist the secret for subsequent tests
    totpSecret = result.current.data!.secret
  })

  test('useUpdateMfaAuthenticator – verifies the TOTP authenticator', async () => {
    const otp = generateTOTP(totpSecret)

    const { result } = renderHook(() => useUpdateMfaAuthenticator(), {
      wrapper,
    })

    await act(async () => {
      await result.current.mutateAsync({ type: AuthenticatorType.Totp, otp })
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data).toBeDefined()
    expect(result.current.data?.mfa).toBe(true)
  })

  test('useListMfaFactors – lists factors with totp enabled', async () => {
    const { result } = renderHook(() => useListMfaFactors(), { wrapper })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data).toBeDefined()
    expect(result.current.data?.totp).toBe(true)
  })

  test('useCreateMfaRecoveryCodes – generates recovery codes', async () => {
    const { result } = renderHook(() => useCreateMfaRecoveryCodes(), {
      wrapper,
    })

    await act(async () => {
      await result.current.mutateAsync()
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data).toBeDefined()
    expect(result.current.data?.recoveryCodes).toBeDefined()
    expect(Array.isArray(result.current.data?.recoveryCodes)).toBe(true)
    expect(result.current.data!.recoveryCodes.length).toBeGreaterThan(0)
  })

  test('useUpdateMfa – disables MFA on the account', async () => {
    const { result } = renderHook(() => useUpdateMfa(), { wrapper })

    await act(async () => {
      await result.current.mutateAsync({ mfa: false })
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data).toBeDefined()
    expect(result.current.data?.mfa).toBe(false)
  })
})
