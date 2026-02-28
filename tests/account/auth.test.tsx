import { act, renderHook, waitFor } from '@testing-library/react'
import { afterAll, beforeAll, describe, expect, test } from 'bun:test'

import {
  fragments,
  getFragmentData,
  useAccount,
  useCreateAnonymousSession,
  useLazyAccount,
  useLogin,
  useLogout,
  useSignUp,
} from '../../src'
import { ID } from '../../src/types'
import { createTestUser, deleteTestUser } from '../setup/helpers'
import { createQueryClient, createWrapper } from '../setup/wrapper'

/*
 * Integration tests for account authentication hooks.
 *
 * These tests require a running Appwrite instance configured via
 * `tests/.test-config.json` or environment variables. They exercise
 * the full GraphQL mutation/query lifecycle through React hooks.
 *
 * Run `bun test tests/account/auth.test.tsx` with a local Appwrite
 * instance (see tests/docker-compose.yml).
 */

// ---------------------------------------------------------------------------
// Shared test user created once for the login / logout / account test suites
// ---------------------------------------------------------------------------
let testUser: Awaited<ReturnType<typeof createTestUser>>

beforeAll(async () => {
  testUser = await createTestUser({ name: 'Auth Test User' })
})

afterAll(async () => {
  if (testUser?.userId) {
    await deleteTestUser(testUser.userId)
  }
})

// ---------------------------------------------------------------------------
// useSignUp
// ---------------------------------------------------------------------------
describe('useSignUp', () => {
  test('should sign up a new user with email and password', async () => {
    const queryClient = createQueryClient()
    const wrapper = createWrapper({ queryClient })
    const uniqueEmail = `signup-${Date.now()}-${Math.random().toString(36).slice(2)}@test.local`

    const { result } = renderHook(() => useSignUp(), { wrapper })

    // signUp mutation should be idle initially
    expect(result.current.signUp.isIdle).toBe(true)

    await act(async () => {
      result.current.signUp.mutate({
        userId: ID.unique(),
        email: uniqueEmail,
        password: 'securepassword123',
        name: 'SignUp Test User',
      })
    })

    await waitFor(() => {
      expect(result.current.signUp.isSuccess).toBe(true)
    })

    const data = result.current.signUp.data
    expect(data).toBeDefined()
    expect(data?.name).toBe('SignUp Test User')
    expect(data?.email).toBe(uniqueEmail)

    // Clean up: delete the user we just created via the server SDK
    // The signUp mutation returns the accountCreate fragment (name, email)
    // but not $id — we need to look up or rely on server SDK for cleanup.
    // Since we can't easily get the userId from signUp response, we use
    // the server helper to find-and-delete by listing or accept the leak
    // in test environments. In practice, teardown.ts handles this.
  })

  test('should expose verifyEmail mutation alongside signUp', () => {
    const queryClient = createQueryClient()
    const wrapper = createWrapper({ queryClient })

    const { result } = renderHook(() => useSignUp(), { wrapper })

    expect(result.current.signUp).toBeDefined()
    expect(result.current.verifyEmail).toBeDefined()
    expect(typeof result.current.signUp.mutate).toBe('function')
    expect(typeof result.current.verifyEmail.mutate).toBe('function')
  })

  test('should report error when signing up with duplicate email', async () => {
    const queryClient = createQueryClient()
    const wrapper = createWrapper({ queryClient })

    const { result } = renderHook(() => useSignUp(), { wrapper })

    // Attempt to sign up with the email already created in beforeAll
    await act(async () => {
      result.current.signUp.mutate({
        userId: ID.unique(),
        email: testUser.email,
        password: 'anotherpassword123',
        name: 'Duplicate User',
      })
    })

    await waitFor(() => {
      expect(result.current.signUp.isError).toBe(true)
    })

    expect(result.current.signUp.error).toBeDefined()
  })
})

// ---------------------------------------------------------------------------
// useLogin
// ---------------------------------------------------------------------------
describe('useLogin', () => {
  test('should log in with email and password', async () => {
    const queryClient = createQueryClient()
    const wrapper = createWrapper({ queryClient })

    const { result } = renderHook(() => useLogin(), { wrapper })

    expect(result.current.login.isIdle).toBe(true)
    expect(result.current.oAuthLogin).toBeDefined()

    await act(async () => {
      result.current.login.mutate({
        email: testUser.email,
        password: testUser.password,
      })
    })

    await waitFor(() => {
      expect(result.current.login.isSuccess).toBe(true)
    })

    const session = result.current.login.data
    expect(session).toBeDefined()
    expect(session?.userId).toBeDefined()
    expect(typeof session?.userId).toBe('string')
    expect(session?.expire).toBeDefined()
    expect(session?.current).toBe(true)
  })

  test('should report error for invalid credentials', async () => {
    const queryClient = createQueryClient()
    const wrapper = createWrapper({ queryClient })

    const { result } = renderHook(() => useLogin(), { wrapper })

    await act(async () => {
      result.current.login.mutate({
        email: 'nonexistent@test.local',
        password: 'wrongpassword',
      })
    })

    await waitFor(() => {
      expect(result.current.login.isError).toBe(true)
    })

    expect(result.current.login.error).toBeDefined()
    expect(result.current.login.data).toBeUndefined()
  })

  test('should expose both login and oAuthLogin mutations', () => {
    const queryClient = createQueryClient()
    const wrapper = createWrapper({ queryClient })

    const { result } = renderHook(() => useLogin(), { wrapper })

    expect(typeof result.current.login.mutate).toBe('function')
    expect(typeof result.current.login.mutateAsync).toBe('function')
    expect(typeof result.current.oAuthLogin.mutate).toBe('function')
    expect(typeof result.current.oAuthLogin.mutateAsync).toBe('function')
  })
})

// ---------------------------------------------------------------------------
// useLogout
// ---------------------------------------------------------------------------
describe('useLogout', () => {
  test('should log out the current session', async () => {
    const queryClient = createQueryClient()
    const wrapper = createWrapper({ queryClient })

    // First, log in to create a session to log out from
    const { result: loginResult } = renderHook(() => useLogin(), { wrapper })

    await act(async () => {
      loginResult.current.login.mutate({
        email: testUser.email,
        password: testUser.password,
      })
    })

    await waitFor(() => {
      expect(loginResult.current.login.isSuccess).toBe(true)
    })

    // Now log out
    const { result: logoutResult } = renderHook(() => useLogout(), { wrapper })

    await act(async () => {
      logoutResult.current.mutate({ sessionId: 'current' })
    })

    await waitFor(() => {
      expect(logoutResult.current.isSuccess).toBe(true)
    })

    expect(logoutResult.current.data).toBeDefined()
  })

  test('should report error when logging out without a session', async () => {
    const queryClient = createQueryClient()
    const wrapper = createWrapper({ queryClient })

    const { result } = renderHook(() => useLogout(), { wrapper })

    await act(async () => {
      result.current.mutate({ sessionId: 'current' })
    })

    await waitFor(() => {
      expect(result.current.isError).toBe(true)
    })

    expect(result.current.error).toBeDefined()
  })
})

// ---------------------------------------------------------------------------
// useAccount
// ---------------------------------------------------------------------------
describe('useAccount', () => {
  test('should return current user data after login', async () => {
    const queryClient = createQueryClient()
    const wrapper = createWrapper({ queryClient })

    // Step 1: Log in
    const { result: loginResult } = renderHook(() => useLogin(), { wrapper })

    await act(async () => {
      loginResult.current.login.mutate({
        email: testUser.email,
        password: testUser.password,
      })
    })

    await waitFor(() => {
      expect(loginResult.current.login.isSuccess).toBe(true)
    })

    // Step 2: Fetch account data
    const { result: accountResult } = renderHook(() => useAccount(), { wrapper })

    await waitFor(() => {
      expect(accountResult.current.isSuccess).toBe(true)
    })

    const rawAccountData = accountResult.current.data
    expect(rawAccountData).toBeDefined()

    const accountData = getFragmentData(fragments.Account_UserFragment, rawAccountData)
    expect(accountData._id).toBeDefined()
    expect(typeof accountData._id).toBe('string')
    expect(accountData.name).toBe(testUser.name)
    expect(accountData.email).toBe(testUser.email)
  })

  test('should report error when no session is active', async () => {
    const queryClient = createQueryClient()
    const wrapper = createWrapper({ queryClient })

    const { result } = renderHook(() => useAccount(), { wrapper })

    await waitFor(() => {
      expect(result.current.isError).toBe(true)
    })

    expect(result.current.error).toBeDefined()
    expect(result.current.data).toBeUndefined()
  })
})

// ---------------------------------------------------------------------------
// useLazyAccount
// ---------------------------------------------------------------------------
describe('useLazyAccount', () => {
  test('should not fetch until run() is called', async () => {
    const queryClient = createQueryClient()
    const wrapper = createWrapper({ queryClient })

    // Log in first
    const { result: loginResult } = renderHook(() => useLogin(), { wrapper })

    await act(async () => {
      loginResult.current.login.mutate({
        email: testUser.email,
        password: testUser.password,
      })
    })

    await waitFor(() => {
      expect(loginResult.current.login.isSuccess).toBe(true)
    })

    // Render useLazyAccount — should NOT fetch automatically
    const { result } = renderHook(() => useLazyAccount(), { wrapper })

    expect(result.current.query.data).toBeUndefined()
    expect(result.current.query.isFetching).toBe(false)
    expect(typeof result.current.run).toBe('function')
  })

  test('should fetch account data when run() is called', async () => {
    const queryClient = createQueryClient()
    const wrapper = createWrapper({ queryClient })

    // Log in first
    const { result: loginResult } = renderHook(() => useLogin(), { wrapper })

    await act(async () => {
      loginResult.current.login.mutate({
        email: testUser.email,
        password: testUser.password,
      })
    })

    await waitFor(() => {
      expect(loginResult.current.login.isSuccess).toBe(true)
    })

    // Render useLazyAccount and trigger fetch
    const { result } = renderHook(() => useLazyAccount(), { wrapper })

    await act(async () => {
      await result.current.run()
    })

    await waitFor(() => {
      expect(result.current.query.isSuccess).toBe(true)
    })

    const rawAccountData = result.current.query.data
    expect(rawAccountData).toBeDefined()

    const accountData = getFragmentData(fragments.Account_UserFragment, rawAccountData)
    expect(accountData._id).toBeDefined()
    expect(accountData.name).toBe(testUser.name)
    expect(accountData.email).toBe(testUser.email)
  })
})

// ---------------------------------------------------------------------------
// useCreateAnonymousSession
// ---------------------------------------------------------------------------
describe('useCreateAnonymousSession', () => {
  test('should create an anonymous session', async () => {
    const queryClient = createQueryClient()
    const wrapper = createWrapper({ queryClient })

    const { result } = renderHook(() => useCreateAnonymousSession(), { wrapper })

    expect(result.current.isIdle).toBe(true)

    await act(async () => {
      result.current.mutate(undefined)
    })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    const sessionData = result.current.data
    expect(sessionData).toBeDefined()
    expect(sessionData?._id).toBeDefined()
    expect(typeof sessionData?._id).toBe('string')
    expect(sessionData?.expire).toBeDefined()
    expect(sessionData?.current).toBe(true)
  })

  test('should expose standard mutation interface', () => {
    const queryClient = createQueryClient()
    const wrapper = createWrapper({ queryClient })

    const { result } = renderHook(() => useCreateAnonymousSession(), { wrapper })

    expect(typeof result.current.mutate).toBe('function')
    expect(typeof result.current.mutateAsync).toBe('function')
    expect(result.current.isIdle).toBe(true)
    expect(result.current.isSuccess).toBe(false)
    expect(result.current.isError).toBe(false)
  })
})

// ---------------------------------------------------------------------------
// Cross-cutting: login → account → logout lifecycle
// ---------------------------------------------------------------------------
describe('auth lifecycle', () => {
  test('should complete full login → fetch account → logout cycle', async () => {
    const queryClient = createQueryClient()
    const wrapper = createWrapper({ queryClient })

    // 1. Login
    const { result: loginResult } = renderHook(() => useLogin(), { wrapper })

    await act(async () => {
      loginResult.current.login.mutate({
        email: testUser.email,
        password: testUser.password,
      })
    })

    await waitFor(() => {
      expect(loginResult.current.login.isSuccess).toBe(true)
    })

    // 2. Fetch account
    const { result: accountResult } = renderHook(() => useAccount(), { wrapper })

    await waitFor(() => {
      expect(accountResult.current.isSuccess).toBe(true)
    })

    const rawAccountData = accountResult.current.data
    const accountData = getFragmentData(fragments.Account_UserFragment, rawAccountData)
    expect(accountData._id).toBeDefined()
    expect(accountData.email).toBe(testUser.email)

    // 3. Logout
    const { result: logoutResult } = renderHook(() => useLogout(), { wrapper })

    await act(async () => {
      logoutResult.current.mutate({ sessionId: 'current' })
    })

    await waitFor(() => {
      expect(logoutResult.current.isSuccess).toBe(true)
    })
  })

  test('should allow mutateAsync for promise-based flow', async () => {
    const queryClient = createQueryClient()
    const wrapper = createWrapper({ queryClient })

    const { result: loginResult } = renderHook(() => useLogin(), { wrapper })

    let session: Awaited<ReturnType<typeof loginResult.current.login.mutateAsync>> | undefined

    await act(async () => {
      session = await loginResult.current.login.mutateAsync({
        email: testUser.email,
        password: testUser.password,
      })
    })

    expect(session).toBeDefined()
    expect(session?.userId).toBeDefined()
    expect(session?.current).toBe(true)

    // Clean up session
    const { result: logoutResult } = renderHook(() => useLogout(), { wrapper })

    await act(async () => {
      await logoutResult.current.mutateAsync({ sessionId: 'current' })
    })

    await waitFor(() => {
      expect(logoutResult.current.isSuccess).toBe(true)
    })
  })
})
