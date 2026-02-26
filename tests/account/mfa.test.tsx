import { QueryClient } from '@tanstack/react-query'
import { act, renderHook, waitFor } from '@testing-library/react'
import { afterAll, beforeAll, describe, expect, test } from 'bun:test'
import { TOTP } from 'otpauth'
import {
  useCreateMfaAuthenticator,
  useCreateMfaRecoveryCodes,
  useDeleteMfaAuthenticator,
  useGetMfaRecoveryCodes,
  useListMfaFactors,
  useLogin,
  useUpdateMfa,
  useUpdateMfaAuthenticator,
  useUpdateMfaRecoveryCodes,
} from '../../src'
import { createTestUser, deleteTestUser } from '../setup/helpers'
import { createQueryClient, createWrapper } from '../setup/wrapper'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

type Wrapper = ReturnType<typeof createWrapper>

function generateTOTP(secret: string): string {
  const totp = new TOTP({ secret, algorithm: 'SHA1', digits: 6, period: 30 })
  return totp.generate()
}

async function loginUser(email: string, password: string, wrapper: Wrapper) {
  const { result } = renderHook(() => useLogin(), { wrapper })

  await act(async () => {
    result.current.login.mutateAsync({ email, password })
  })

  await waitFor(() => expect(result.current.login.isSuccess).toBe(true))
}

// ---------------------------------------------------------------------------
// MFA Integration Tests
// ---------------------------------------------------------------------------

describe('MFA (Multi-Factor Authentication)', () => {
  let userId: string
  let email: string
  let password: string
  let queryClient: QueryClient
  let wrapper: Wrapper

  /** TOTP secret returned when creating the authenticator. */
  let totpSecret: string

  /** Recovery codes created during the MFA setup flow. */
  let recoveryCodes: string[]

  // -----------------------------------------------------------------------
  // Setup – create user, login, and share a single QueryClient / wrapper
  // so that the session cookie persists across all ordered tests.
  // -----------------------------------------------------------------------

  beforeAll(async () => {
    const user = await createTestUser({ name: 'MFA Test User' })
    userId = user.userId
    email = user.email
    password = user.password

    queryClient = createQueryClient()
    wrapper = createWrapper({ queryClient })

    await loginUser(email, password, wrapper)
  })

  // -----------------------------------------------------------------------
  // Teardown – best-effort MFA disable & user cleanup
  // -----------------------------------------------------------------------

  afterAll(async () => {
    try {
      // Attempt to disable MFA in case a test failed mid-flow
      const { result: mfaResult } = renderHook(() => useUpdateMfa(), { wrapper })
      await act(async () => {
        mfaResult.current.mutateAsync({ mfa: false })
      })
      await waitFor(() => expect(mfaResult.current.isSuccess).toBe(true))
    } catch {
      // MFA may already be disabled – ignore
    }

    await deleteTestUser(userId)
  })

  // -----------------------------------------------------------------------
  // 1. Enable MFA
  // -----------------------------------------------------------------------

  test('useUpdateMfa – enables MFA on the account', async () => {
    const { result } = renderHook(() => useUpdateMfa(), { wrapper })

    await act(async () => {
      result.current.mutateAsync({ mfa: true })
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data).toBeDefined()
    expect(result.current.data?.mfa).toBe(true)
  })

  // -----------------------------------------------------------------------
  // 2. Create TOTP Authenticator
  // -----------------------------------------------------------------------

  test('useCreateMfaAuthenticator – creates a TOTP authenticator', async () => {
    const { result } = renderHook(() => useCreateMfaAuthenticator(), { wrapper })

    await act(async () => {
      result.current.mutateAsync({ type: 'totp' })
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

  // -----------------------------------------------------------------------
  // 3. Verify / Activate the Authenticator
  // -----------------------------------------------------------------------

  test('useUpdateMfaAuthenticator – verifies the TOTP authenticator', async () => {
    const otp = generateTOTP(totpSecret)

    const { result } = renderHook(() => useUpdateMfaAuthenticator(), { wrapper })

    await act(async () => {
      result.current.mutateAsync({ type: 'totp', otp })
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data).toBeDefined()
    expect(result.current.data?.mfa).toBe(true)
  })

  // -----------------------------------------------------------------------
  // 4. List MFA Factors
  // -----------------------------------------------------------------------

  test('useListMfaFactors – lists factors with totp enabled', async () => {
    const { result } = renderHook(() => useListMfaFactors(), { wrapper })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data).toBeDefined()
    expect(result.current.data?.totp).toBe(true)
  })

  // -----------------------------------------------------------------------
  // 5. Create Recovery Codes
  // -----------------------------------------------------------------------

  test('useCreateMfaRecoveryCodes – generates recovery codes', async () => {
    const { result } = renderHook(() => useCreateMfaRecoveryCodes(), { wrapper })

    await act(async () => {
      result.current.mutateAsync()
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data).toBeDefined()
    expect(result.current.data?.recoveryCodes).toBeDefined()
    expect(Array.isArray(result.current.data?.recoveryCodes)).toBe(true)
    expect(result.current.data!.recoveryCodes.length).toBeGreaterThan(0)

    recoveryCodes = result.current.data!.recoveryCodes
  })

  // -----------------------------------------------------------------------
  // 6. Get Recovery Codes
  // -----------------------------------------------------------------------

  test.skip('useGetMfaRecoveryCodes – retrieves the stored recovery codes (requires recent MFA challenge)', async () => {
    const { result } = renderHook(() => useGetMfaRecoveryCodes(), { wrapper })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data).toBeDefined()
    expect(result.current.data?.recoveryCodes).toBeDefined()
    expect(Array.isArray(result.current.data?.recoveryCodes)).toBe(true)
    expect(result.current.data!.recoveryCodes.length).toBe(recoveryCodes.length)
  })

  // -----------------------------------------------------------------------
  // 7. Regenerate Recovery Codes
  // -----------------------------------------------------------------------

  test.skip('useUpdateMfaRecoveryCodes – regenerates recovery codes (requires recent MFA challenge)', async () => {
    const { result } = renderHook(() => useUpdateMfaRecoveryCodes(), { wrapper })

    await act(async () => {
      result.current.mutateAsync()
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data).toBeDefined()
    expect(result.current.data?.recoveryCodes).toBeDefined()
    expect(Array.isArray(result.current.data?.recoveryCodes)).toBe(true)
    expect(result.current.data!.recoveryCodes.length).toBeGreaterThan(0)

    // New codes should differ from the original set
    const newCodes = result.current.data!.recoveryCodes
    const codesChanged = newCodes.some((code) => !recoveryCodes.includes(code))
    expect(codesChanged).toBe(true)
  })

  // -----------------------------------------------------------------------
  // 8. Delete TOTP Authenticator
  // -----------------------------------------------------------------------

  test.skip('useDeleteMfaAuthenticator – removes the TOTP authenticator (requires recent MFA challenge)', async () => {
    const { result } = renderHook(() => useDeleteMfaAuthenticator(), { wrapper })

    await act(async () => {
      result.current.mutateAsync({ type: 'totp' })
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data).toBeDefined()
  })

  // -----------------------------------------------------------------------
  // 9. Disable MFA
  // -----------------------------------------------------------------------

  test('useUpdateMfa – disables MFA on the account', async () => {
    const { result } = renderHook(() => useUpdateMfa(), { wrapper })

    await act(async () => {
      result.current.mutateAsync({ mfa: false })
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data).toBeDefined()
    expect(result.current.data?.mfa).toBe(false)
  })

  // -----------------------------------------------------------------------
  // MFA Challenge hooks – skipped
  // -----------------------------------------------------------------------

  test.skip('useCreateMfaChallenge – requires a separate login flow with MFA enforcement', () => {
    // useCreateMfaChallenge creates a challenge during the login flow when
    // MFA is enforced. Testing it requires a full login attempt against an
    // account with MFA already active, which produces a challenge instead of
    // a session. This needs a dedicated test harness that:
    //   1. Enables MFA and registers an authenticator (done above)
    //   2. Starts a NEW login (separate client / session) to trigger the challenge
    //   3. Calls useCreateMfaChallenge with factor: 'totp'
    //   4. Solves the challenge via useUpdateMfaChallenge
    // This is not feasible within the current shared-session test setup.
  })

  test.skip('useUpdateMfaChallenge – requires a challengeId from useCreateMfaChallenge', () => {
    // useUpdateMfaChallenge completes a challenge started by
    // useCreateMfaChallenge. It requires a valid challengeId and a TOTP code.
    // Since creating the challenge depends on an active MFA-enforced login
    // flow (see above), this hook cannot be tested in isolation here.
  })
})
