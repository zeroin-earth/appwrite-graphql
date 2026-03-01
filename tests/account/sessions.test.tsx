import type { QueryClient } from '@tanstack/react-query'
import { act, renderHook, waitFor, within } from '@testing-library/react'
import { afterAll, beforeAll, beforeEach, describe, expect, test } from 'bun:test'

import {
  useCreateJWT,
  useCreateMagicURLToken,
  useCreateSession,
  useDeleteSession,
  useDeleteSessions,
  useGetSession,
  useListSessions,
  useSuspenseCreateJWT,
  useUpdateSession,
} from '../../src'
import {
  checkMail,
  createTestUser,
  deleteTestUser,
  emptyMail,
  loginUser,
  logoutUser,
  renderMessage,
} from '../setup/helpers'
import { createQueryClient, createWrapper } from '../setup/wrapper'

type Wrapper = ReturnType<typeof createWrapper>

describe('useCreateSession', () => {
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

  test('creates a session from a magic URL token', async () => {
    await loginUser(email, password, wrapper)

    const { result: magicURLResult } = renderHook(() => useCreateMagicURLToken(), { wrapper })

    await act(async () => {
      await magicURLResult.current.mutateAsync({
        userId,
        email,
        phrase: false,
      })
    })

    await waitFor(() => expect(magicURLResult.current.isSuccess).toBe(true))

    await act(async () => {
      await new Promise((r) => setTimeout(r, 3000))
    })

    const message = await waitFor(async () => {
      const emails = await checkMail()
      expect(emails.messages.length).toBeGreaterThan(0)
      return emails.messages[0]
    })

    await renderMessage(message.ID)
    const emailBody = within(document.body)

    expect(emailBody.getAllByText(/Sign in to Test Project/)).toBeDefined()

    const button = emailBody.getAllByText(/Sign in to Test Project/)[1]

    expect(button.getAttribute('href')).toBeDefined()

    const url = new URL(button.getAttribute('href') || '')
    expect(url.pathname).toBe('/console/auth/magic-url')

    await emptyMail()

    const uid = url.searchParams.get('userId')
    const secret = url.searchParams.get('secret')

    await logoutUser(wrapper)

    const { result } = renderHook(() => useCreateSession(), { wrapper })

    await act(async () => {
      await result.current.mutateAsync({
        userId: uid || '',
        secret: secret || '',
      })
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
  })
})

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

    const { result } = renderHook(() => useGetSession({ sessionId: 'current' }), { wrapper })

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
      await result.current.mutateAsync()
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data).toBeDefined()
    expect(result.current.data?.jwt).toBeDefined()
    expect(typeof result.current.data?.jwt).toBe('string')
    expect(result.current.data!.jwt.length).toBeGreaterThan(0)
  })

  test('creates a JWT token with useSuspenseQuery', async () => {
    wrapper = createWrapper({ queryClient, suspense: true })
    await loginUser(email, password, wrapper)

    const { result } = renderHook(() => useSuspenseCreateJWT(), { wrapper })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data).toBeDefined()
    expect(result.current.data?.jwt).toBeDefined()
    expect(typeof result.current.data?.jwt).toBe('string')
    expect(result.current.data!.jwt.length).toBeGreaterThan(0)
  })
})

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
      await result.current.mutateAsync({ sessionId })
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data).toBeDefined()
    expect(result.current.data?.userId).toBeDefined()
    expect(result.current.data?.expire).toBeDefined()
  })
})

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
      await result.current.mutateAsync({ sessionId })
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data).toBeDefined()
    expect(result.current.data?.status).toBeDefined()
  })
})

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
      await result.current.mutateAsync()
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data).toBeDefined()
    expect(result.current.data?.status).toBeDefined()
  })
})
