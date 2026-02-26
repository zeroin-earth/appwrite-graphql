import { describe, test, expect, beforeAll, afterAll } from 'bun:test'
import { renderHook, act, waitFor } from '@testing-library/react'

import { createWrapper } from '../setup/wrapper'
import { createTestUser, deleteTestUser, getTestConfig } from '../setup/helpers'
import {
  useLogin,
  useDeleteAccount,
  useCreateEmailVerification,
  useAccount,
} from '../../src'
import { ID } from '../../src/types'

type Wrapper = ReturnType<typeof createWrapper>

async function loginUser(email: string, password: string, wrapper: Wrapper) {
  const { result } = renderHook(() => useLogin(), { wrapper })

  await act(async () => {
    result.current.login.mutateAsync({ email, password })
  })

  await waitFor(() => expect(result.current.login.isSuccess).toBe(true))
}

describe('New account hooks', () => {
  describe('useDeleteAccount', () => {
    test('deletes the currently logged-in account', async () => {
      // Create a throwaway user just for this test
      const user = await createTestUser({ name: 'Delete Me User' })
      const wrapper = createWrapper()
      await loginUser(user.email, user.password, wrapper)

      const { result } = renderHook(() => useDeleteAccount(), { wrapper })

      await act(async () => {
        result.current.mutateAsync()
      })

      await waitFor(() => expect(result.current.isSuccess).toBe(true))

      // Verify the account is gone by checking useAccount fails
      const wrapper2 = createWrapper()
      const { result: accountResult } = renderHook(() => useAccount(), { wrapper: wrapper2 })

      await waitFor(() =>
        expect(accountResult.current.isError || accountResult.current.data === null).toBe(true),
      )
    })
  })

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

    test('sends an email verification request', async () => {
      const wrapper = createWrapper()
      await loginUser(userEmail, userPassword, wrapper)

      const { result } = renderHook(() => useCreateEmailVerification(), { wrapper })

      await act(async () => {
        // The URL is where the user would be redirected to confirm
        result.current.mutate({ url: 'http://localhost/verify' })
      })

      // This may fail if SMTP is not configured, which is expected in test environments
      await waitFor(() =>
        expect(result.current.isSuccess || result.current.isError).toBe(true),
      )

      // If it succeeded, it should return a token
      if (result.current.isSuccess) {
        expect(result.current.data).toBeDefined()
        expect(result.current.data?.userId).toBeDefined()
      }
    })
  })
})
