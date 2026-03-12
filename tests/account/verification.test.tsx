import { act, renderHook, waitFor, within } from '@testing-library/react'
import { afterAll, beforeAll, describe, expect, test } from 'bun:test'

import { useCreateEmailVerification, useVerification } from '../../src'
import {
  checkMail,
  createTestUser,
  deleteTestUser,
  emptyMail,
  loginUser,
  renderMessage,
} from '../setup/helpers'
import { createWrapper } from '../setup/wrapper'

describe('useVerification', () => {
  let userId: string
  let userEmail: string
  let userPassword: string

  beforeAll(async () => {
    const user = await createTestUser({ name: 'Verification Hook User' })
    userId = user.userId
    userEmail = user.email
    userPassword = user.password
  })

  afterAll(async () => {
    await emptyMail()
    await deleteTestUser(userId)
  })

  test('confirms email verification via useVerification', async () => {
    const wrapper = createWrapper()
    await loginUser(userEmail, userPassword, wrapper)

    // Step 1: Create email verification request
    const { result: createResult } = renderHook(() => useCreateEmailVerification(), { wrapper })

    await act(async () => {
      await createResult.current.mutateAsync({ url: 'http://localhost/verify' })
    })

    await waitFor(() => expect(createResult.current.isSuccess).toBe(true))

    // Wait for email delivery
    await act(async () => {
      await new Promise((r) => setTimeout(r, 3000))
    })

    // Step 2: Extract verification secret from email
    const message = await waitFor(async () => {
      const emails = await checkMail()
      expect(emails.messages.length).toBeGreaterThan(0)
      return emails.messages[0]
    })

    await renderMessage(message.ID)
    const emailBody = within(document.body)

    const button = emailBody.getByText(/Confirm email address/)
    expect(button.getAttribute('href')).toBeDefined()

    const url = new URL(button.getAttribute('href') || '')
    const secret = url.searchParams.get('secret') || ''
    expect(secret).toBeTruthy()

    // Step 3: Confirm verification using useVerification hook
    const { result } = renderHook(() => useVerification(), { wrapper })

    await act(async () => {
      await result.current.mutateAsync({ userId, secret })
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data).toBeDefined()
    expect(result.current.data?.userId).toBe(userId)
    expect(result.current.data?.secret).toBeDefined()
    expect(result.current.data?.expire).toBeDefined()

    await emptyMail()
  })

  test('fails with invalid secret', async () => {
    const wrapper = createWrapper()
    await loginUser(userEmail, userPassword, wrapper)

    const { result } = renderHook(() => useVerification(), { wrapper })

    await act(async () => {
      result.current.mutate({ userId, secret: 'invalid-secret' })
    })

    await waitFor(() => expect(result.current.isError).toBe(true))
  })

  test('fails with missing userId', async () => {
    const wrapper = createWrapper()
    await loginUser(userEmail, userPassword, wrapper)

    const { result } = renderHook(() => useVerification(), { wrapper })

    await act(async () => {
      result.current.mutate({ userId: '', secret: 'some-secret' })
    })

    await waitFor(() => expect(result.current.isError).toBe(true))
  })
})
