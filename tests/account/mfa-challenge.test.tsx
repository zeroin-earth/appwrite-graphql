import type { QueryClient } from '@tanstack/react-query'
import { act, renderHook, waitFor } from '@testing-library/react'
import { afterAll, beforeAll, describe, expect, test } from 'bun:test'

import {
  AuthenticationFactor,
  AuthenticatorType,
  useCreateMfaChallenge,
  useCreateMfaRecoveryCodes,
  useDeleteMfaAuthenticator,
  useGetMfaRecoveryCodes,
  useUpdateMfa,
  useUpdateMfaChallenge,
  useUpdateMfaRecoveryCodes,
} from '../../src'
import { createTestUser, deleteTestUser, generateTOTP, loginUser, setupOTP } from '../setup/helpers'
import { createQueryClient, createWrapper } from '../setup/wrapper'

type Wrapper = ReturnType<typeof createWrapper>

describe('MFA (Multi-Factor Authentication) Challenge', () => {
  let userId: string
  let email: string
  let password: string
  let queryClient: QueryClient
  let wrapper: Wrapper

  /** TOTP secret returned when creating the authenticator. */
  let totpSecret: string

  /** Recovery codes created during the MFA setup flow. */
  let recoveryCodes: (string | null)[]

  beforeAll(async () => {
    const user = await createTestUser({ name: 'MFA Challenge Test User' })
    userId = user.userId
    email = user.email
    password = user.password

    queryClient = createQueryClient()
    wrapper = createWrapper({ queryClient })

    await loginUser(email, password, wrapper)
    const otp = await setupOTP(wrapper)
    totpSecret = otp.totpSecret
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

  test('useCreateMfaChallenge, useUpdateMfaChallenge with valid OTP', async () => {
    const { result: createMfaChallengeResult } = renderHook(() => useCreateMfaChallenge(), {
      wrapper,
    })

    await act(async () => {
      await createMfaChallengeResult.current.mutateAsync({ factor: AuthenticationFactor.Totp })
    })

    await waitFor(() => expect(createMfaChallengeResult.current.isSuccess).toBe(true))

    const { result: updateMfaChallengeResult } = renderHook(() => useUpdateMfaChallenge(), {
      wrapper,
    })

    await waitFor(async () =>
      expect(
        updateMfaChallengeResult.current.mutateAsync({
          challengeId: createMfaChallengeResult.current.data?._id || '',
          otp: '777777', // Invalid OTP, but we just want to verify the flow works
        }),
      ).rejects.toBeDefined(),
    )

    await waitFor(() => expect(updateMfaChallengeResult.current.isError).toBe(true))

    await act(async () =>
      updateMfaChallengeResult.current.mutateAsync({
        challengeId: createMfaChallengeResult.current.data?._id || '',
        otp: generateTOTP(totpSecret),
      }),
    )

    await waitFor(() => expect(updateMfaChallengeResult.current.isSuccess).toBe(true))
  })

  test('useGetMfaRecoveryCodes', async () => {
    const { result: codes } = renderHook(() => useCreateMfaRecoveryCodes(), {
      wrapper,
    })

    await act(async () => {
      await codes.current.mutateAsync()
    })
    await waitFor(() => expect(codes.current.isSuccess).toBe(true))

    // Store the codes from CREATE – these are the actual usable codes
    recoveryCodes = codes.current.data!.recoveryCodes ?? []

    const { result } = renderHook(() => useGetMfaRecoveryCodes(), { wrapper })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data).toBeDefined()
    expect(result.current.data?.recoveryCodes).toBeDefined()

    expect(Array.isArray(result.current.data?.recoveryCodes)).toBe(true)
    expect(result.current.data!.recoveryCodes?.length).toBe(
      codes.current.data!.recoveryCodes?.length,
    )
  })

  test.skip('useCreateMfaChallenge, useUpdateMfaChallenge with valid Recovery Code — Appwrite 1.8.1 returns user_invalid_token on both REST and GraphQL endpoints (server bug, not GraphQL-specific)', async () => {
    const { result } = renderHook(() => useGetMfaRecoveryCodes(), { wrapper })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data).toBeDefined()
    expect(result.current.data?.recoveryCodes).toBeDefined()

    // Store the codes from CREATE – these are the actual usable codes
    const rCodes = result.current.data!.recoveryCodes ?? []

    const { result: createResult, unmount: unmountCreate } = renderHook(
      () => useCreateMfaChallenge(),
      { wrapper },
    )

    await act(async () => {
      await createResult.current.mutateAsync({ factor: AuthenticationFactor.Recoverycode })
    })

    await waitFor(() => expect(createResult.current.isSuccess).toBe(true))
    const challengeId = createResult.current.data?._id || ''
    unmountCreate()

    const { result: updateResult, unmount: unmountUpdate } = renderHook(
      () => useUpdateMfaChallenge(),
      { wrapper },
    )

    await act(async () =>
      updateResult.current.mutateAsync({
        challengeId,
        otp: rCodes[0] ?? '',
      }),
    )

    await waitFor(() => expect(updateResult.current.isSuccess).toBe(true))
    unmountUpdate()
  })

  test('useUpdateMfaRecoveryCodes', async () => {
    const { result } = renderHook(() => useUpdateMfaRecoveryCodes(), {
      wrapper,
    })

    await act(async () => {
      await result.current.mutateAsync()
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data).toBeDefined()
    expect(result.current.data?.recoveryCodes).toBeDefined()
    expect(Array.isArray(result.current.data?.recoveryCodes)).toBe(true)
    expect(result.current.data!.recoveryCodes?.length).toBeGreaterThan(0)

    // New codes should differ from the original set
    const newCodes = result.current.data!.recoveryCodes ?? []
    const codesChanged = newCodes.some((code) => !recoveryCodes.includes(code))
    expect(codesChanged).toBe(true)
  })

  test('useDeleteMfaAuthenticator', async () => {
    const { result } = renderHook(() => useDeleteMfaAuthenticator(), {
      wrapper,
    })

    await act(async () => {
      await result.current.mutateAsync({ type: AuthenticatorType.Totp })
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data).toBeDefined()
  })
})
