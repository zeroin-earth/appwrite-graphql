import { act, renderHook, waitFor } from '@testing-library/react'
import { afterAll, beforeAll, describe, expect, test } from 'bun:test'

import {
  useCreatePhoneToken,
  useCreatePhoneVerification,
  useUpdatePhone,
  useUpdatePhoneSession,
  useUpdatePhoneVerification,
} from '../../src'
import {
  clearSMSMessages,
  createTestUser,
  deleteTestUser,
  getSMSMessages,
  loginUser,
  logoutUser,
} from '../setup/helpers'
import { createQueryClient, createWrapper } from '../setup/wrapper'

describe('phone hooks', () => {
  let userId: string
  let email: string
  let password: string
  const phone = '+12065551234'

  beforeAll(async () => {
    const user = await createTestUser({ name: 'UpdatePhone User' })
    userId = user.userId
    email = user.email
    password = user.password

    await clearSMSMessages()
  })

  afterAll(async () => {
    await deleteTestUser(userId)
  })

  test('updates the account phone number', async () => {
    const queryClient = createQueryClient()
    const wrapper = createWrapper({ queryClient })
    await loginUser(email, password, wrapper)

    const { result } = renderHook(() => useUpdatePhone(), { wrapper })

    await act(async () => {
      await result.current.mutateAsync({ phone, password })
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data).toBeDefined()
    expect(result.current.data?.phone).toBe(phone)
  })

  test('fails with incorrect password', async () => {
    const queryClient = createQueryClient()
    const wrapper = createWrapper({ queryClient })
    await loginUser(email, password, wrapper)

    const { result } = renderHook(() => useUpdatePhone(), { wrapper })

    await act(async () => {
      result.current.mutate({
        phone: '+12065559999',
        password: 'wrongpassword',
      })
    })

    await waitFor(() => expect(result.current.isError).toBe(true))
  })
  describe('phone verification hooks', () => {
    test('create and update phone verification flow', async () => {
      const queryClient = createQueryClient()
      const wrapper = createWrapper({ queryClient })
      await loginUser(email, password, wrapper)

      const { result } = renderHook(() => useCreatePhoneVerification(), {
        wrapper,
      })

      await act(async () => {
        await result.current.mutateAsync()
      })

      await waitFor(() => expect(result.current.isSuccess).toBe(true))

      expect(result.current.data).toBeDefined()

      const messages = await getSMSMessages()
      expect(messages.length).toBeGreaterThan(0)

      const secret = messages[0].message

      const { result: updateResult } = renderHook(() => useUpdatePhoneVerification(), { wrapper })

      await act(async () => {
        await updateResult.current.mutateAsync({ userId, secret })
      })

      await waitFor(() => expect(updateResult.current.isSuccess).toBe(true))

      expect(updateResult.current.data).toBeDefined()

      await clearSMSMessages()
    })
  })

  describe('phone token hooks', () => {
    test('create phone token flow', async () => {
      const queryClient = createQueryClient()
      const wrapper = createWrapper({ queryClient })
      await loginUser(email, password, wrapper)

      const { result } = renderHook(() => useCreatePhoneToken(), { wrapper })

      await act(async () => {
        await result.current.mutateAsync({ userId, phone })
      })

      await waitFor(() => expect(result.current.isSuccess).toBe(true))

      expect(result.current.data).toBeDefined()

      const messages = await getSMSMessages()
      expect(messages.length).toBeGreaterThan(0)

      const secret = messages[0].message

      await logoutUser(wrapper)

      const { result: updateResult } = renderHook(() => useUpdatePhoneSession(), { wrapper })

      await act(async () => {
        await updateResult.current.mutateAsync({ userId, secret })
      })

      await waitFor(() => expect(updateResult.current.isSuccess).toBe(true))

      expect(updateResult.current.data).toBeDefined()

      await clearSMSMessages()
    })
  })
})
