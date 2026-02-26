import { describe, test, expect, beforeAll, afterAll, beforeEach } from 'bun:test'
import { renderHook, act, waitFor } from '@testing-library/react'
import { QueryClient } from '@tanstack/react-query'
import { createWrapper, createQueryClient } from '../setup/wrapper'
import { createTestUser, deleteTestUser } from '../setup/helpers'
import {
  useLogin,
  useListSessions,
  useGetSession,
  useCreateJWT,
  useUpdateSession,
  useDeleteSession,
  useDeleteSessions,
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
// useListSessions
// ---------------------------------------------------------------------------

describe('useListSessions', () => {
  let userId: string
  let email: string
  let password: string
  let queryClient: QueryClient
  let wrapper: Wrapper

  beforeAll(async () => {
    const user = await createTestUser({ name: 'ListSessions User' })
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

  test('lists sessions after login', async () => {
    await loginUser(email, password, wrapper)

    const { result } = renderHook(() => useListSessions(), { wrapper })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data).toBeDefined()
    expect(result.current.data?.sessions).toBeDefined()
    expect(Array.isArray(result.current.data?.sessions)).toBe(true)
    expect(result.current.data!.sessions.length).toBeGreaterThanOrEqual(1)

    const session = result.current.data!.sessions[0]
    expect(session._id).toBeDefined()
    expect(session._createdAt).toBeDefined()
    expect(session.osName).toBeDefined()
    expect(session.clientName).toBeDefined()
  })
})

// ---------------------------------------------------------------------------
// useGetSession
// ---------------------------------------------------------------------------

describe('useGetSession', () => {
  let userId: string
  let email: string
  let password: string
  let queryClient: QueryClient
  let wrapper: Wrapper

  beforeAll(async () => {
    const user = await createTestUser({ name: 'GetSession User' })
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

  test('gets the current session', async () => {
    await loginUser(email, password, wrapper)

    const { result } = renderHook(
      () => useGetSession({ sessionId: 'current' }),
      { wrapper },
    )

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data).toBeDefined()

    // The hook's TData generic is set to GetSessionQueryVariables in source,
    // but at runtime the actual session object is returned with full fields.
    const session = result.current.data as Record<string, unknown>
    expect(session.userId).toBeDefined()
    expect(session.expire).toBeDefined()
    expect(session.current).toBe(true)
  })
})

// ---------------------------------------------------------------------------
// useCreateJWT
// ---------------------------------------------------------------------------

describe('useCreateJWT', () => {
  let userId: string
  let email: string
  let password: string
  let queryClient: QueryClient
  let wrapper: Wrapper

  beforeAll(async () => {
    const user = await createTestUser({ name: 'CreateJWT User' })
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

  test('creates a JWT token', async () => {
    await loginUser(email, password, wrapper)

    const { result } = renderHook(() => useCreateJWT(), { wrapper })

    await act(async () => {
      result.current.mutate()
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data).toBeDefined()
    expect(result.current.data?.jwt).toBeDefined()
    expect(typeof result.current.data?.jwt).toBe('string')
    expect(result.current.data!.jwt.length).toBeGreaterThan(0)
  })
})

// ---------------------------------------------------------------------------
// useUpdateSession
// ---------------------------------------------------------------------------

describe('useUpdateSession', () => {
  let userId: string
  let email: string
  let password: string
  let queryClient: QueryClient
  let wrapper: Wrapper

  beforeAll(async () => {
    const user = await createTestUser({ name: 'UpdateSession User' })
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

  test('extends a session', async () => {
    await loginUser(email, password, wrapper)

    // First, get the list of sessions to obtain a real session ID
    const { result: listResult } = renderHook(() => useListSessions(), { wrapper })

    await waitFor(() => expect(listResult.current.isSuccess).toBe(true))

    const sessionId = listResult.current.data!.sessions[0]._id

    // Now update (extend) that session
    const { result } = renderHook(() => useUpdateSession(), { wrapper })

    await act(async () => {
      result.current.mutate({ sessionId })
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data).toBeDefined()
    expect(result.current.data?.userId).toBeDefined()
    expect(result.current.data?.expire).toBeDefined()
  })
})

// ---------------------------------------------------------------------------
// useDeleteSession
// ---------------------------------------------------------------------------

describe('useDeleteSession', () => {
  let userId: string
  let email: string
  let password: string
  let queryClient: QueryClient
  let wrapper: Wrapper

  beforeAll(async () => {
    const user = await createTestUser({ name: 'DeleteSession User' })
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

  test('deletes a specific session', async () => {
    await loginUser(email, password, wrapper)

    // Get the list of sessions to find a session ID to delete
    const { result: listResult } = renderHook(() => useListSessions(), { wrapper })

    await waitFor(() => expect(listResult.current.isSuccess).toBe(true))

    const sessionId = listResult.current.data!.sessions[0]._id

    // Delete that session
    const { result } = renderHook(() => useDeleteSession(), { wrapper })

    await act(async () => {
      result.current.mutate({ sessionId })
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data).toBeDefined()
    expect(result.current.data?.status).toBe(true)
  })
})

// ---------------------------------------------------------------------------
// useDeleteSessions — tested last because it logs out all sessions
// ---------------------------------------------------------------------------

describe('useDeleteSessions', () => {
  let userId: string
  let email: string
  let password: string
  let queryClient: QueryClient
  let wrapper: Wrapper

  beforeAll(async () => {
    const user = await createTestUser({ name: 'DeleteSessions User' })
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

  test('deletes all sessions', async () => {
    await loginUser(email, password, wrapper)

    const { result } = renderHook(() => useDeleteSessions(), { wrapper })

    await act(async () => {
      result.current.mutate()
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data).toBeDefined()
    expect(result.current.data?.status).toBe(true)
  })
})
