import { act, renderHook, waitFor, within } from '@testing-library/react'
import { afterAll, beforeAll, describe, expect, test } from 'bun:test'

import { useCreateEmailVerification, useUpdateEmailVerification } from '../../src'
import {
  checkMail,
  createTestUser,
  deleteTestUser,
  emptyMail,
  loginUser,
  renderMessage,
} from '../setup/helpers'
import { createWrapper } from '../setup/wrapper'

describe('New account hooks', () => {
  describe('useCreateEmailVerification', () => {
    let userId: string
    let userEmail: string
    let userPassword: string

    beforeAll(async () => {
      const user = await createTestUser({ name: 'Verification User' })
      userId = user.userId
      userEmail = user.email
      userPassword = user.password
    })

    afterAll(async () => {
      await deleteTestUser(userId)
    })

    test('sends and updates an email verification request', async () => {
      const wrapper = createWrapper()
      await loginUser(userEmail, userPassword, wrapper)

      const { result } = renderHook(() => useCreateEmailVerification(), {
        wrapper,
      })

      await act(async () => {
        await result.current.mutateAsync({ url: 'http://localhost/verify' })
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

      expect(emailBody.getByText(/Confirm email address/)).toBeDefined()

      const button = emailBody.getByText(/Confirm email address/)

      expect(button.getAttribute('href')).toBeDefined()

      const url = new URL(button.getAttribute('href') || '')
      expect(url.pathname).toBe('/verify')

      const params = new URLSearchParams(url.search)

      expect(params.get('userId')).toBe(userId)
      expect(params.get('secret')).toBeDefined()

      const secret = params.get('secret') || ''

      const { result: updateResult } = renderHook(() => useUpdateEmailVerification(), { wrapper })

      await act(async () => {
        await updateResult.current.mutateAsync({
          userId,
          secret,
        })
      })

      await waitFor(() => expect(updateResult.current.isSuccess).toBe(true))

      await emptyMail()
    })
  })
})
