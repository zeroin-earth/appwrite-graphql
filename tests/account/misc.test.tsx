import { act, renderHook, waitFor, within } from '@testing-library/react'
import { afterAll, beforeAll, describe, expect, test } from 'bun:test'

import {
  useCreateEmailToken,
  useCreateMagicURLToken,
  useListIdentities,
  useLogs,
  usePasswordRecovery,
  useResetPassword,
  useUpdateMagicURLSession,
} from '../../src'
import {
  checkMail,
  createServerClient,
  createTestUser,
  deleteTestUser,
  emptyMail,
  loginUser,
  logoutUser,
  renderMessage,
} from '../setup/helpers'
import { createQueryClient, createWrapper } from '../setup/wrapper'

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
    await logoutUser(wrapper)
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

    await logoutUser(wrapper)
  })

  test('useCreateEmailToken', async () => {
    const wrapper = createWrapper()

    const { result } = renderHook(() => useCreateEmailToken(), { wrapper })

    await act(async () => {
      await result.current.mutateAsync({
        userId: user.userId,
        email: user.email,
        phrase: false,
      })
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

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

    expect(emailBody.getByText(/verification code/)).toBeDefined()

    await emptyMail()
  })

  test('useCreateMagicURLToken & useUpdateMagicURLSession', async () => {
    const wrapper = createWrapper()

    const { result } = renderHook(() => useCreateMagicURLToken(), { wrapper })

    await act(async () => {
      await result.current.mutateAsync({
        userId: user.userId,
        email: user.email,
        phrase: false,
      })
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

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

    const userId = url.searchParams.get('userId')
    const secret = url.searchParams.get('secret')

    const { result: updateResult } = renderHook(() => useUpdateMagicURLSession(), { wrapper })

    await act(async () => {
      await updateResult.current.mutateAsync({
        userId: userId || '',
        secret: secret || '',
      })
    })

    await waitFor(() => expect(updateResult.current.isSuccess).toBe(true))
    await logoutUser(wrapper)
  })

  test('usePasswordRecovery & useResetPassword', async () => {
    const wrapper = createWrapper()

    const { result } = renderHook(() => usePasswordRecovery(), { wrapper })

    await act(async () => {
      await result.current.mutateAsync({
        email: user.email,
        url: 'https://localhost/reset-password',
      })
    })

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

    expect(emailBody.getByText(/Reset password/)).toBeDefined()

    const button = emailBody.getByText(/Reset password/)

    expect(button.getAttribute('href')).toBeDefined()

    const url = new URL(button.getAttribute('href') || '')
    expect(url.pathname).toBe('/reset-password')

    const params = new URLSearchParams(url.search)

    expect(params.get('userId')).toBe(user.userId)
    expect(params.get('secret')).toBeDefined()

    const secret = params.get('secret') || ''

    const { result: resetResult } = renderHook(() => useResetPassword(), { wrapper })

    await act(async () => {
      await resetResult.current.mutateAsync({
        userId: user.userId,
        secret,
        password: 'newpassword',
      })
    })

    await waitFor(() => expect(resetResult.current.isSuccess).toBe(true))

    // Login with new password to verify it works
    await loginUser(user.email, 'newpassword', wrapper)
    await logoutUser(wrapper)

    // Reset password back to original via server SDK (recovery tokens are single-use)
    const { users } = createServerClient()
    await users.updatePassword({ userId: user.userId, password: user.password })
  })

  test.skip('useCreateOAuth2Token requires OAuth provider configuration', () => {})
  test.skip('useDeleteIdentity requires identity from OAuth provider', () => {})
})
