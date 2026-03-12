import { act, renderHook, waitFor } from '@testing-library/react'
import { afterAll, beforeAll, describe, expect, test } from 'bun:test'

import { useCreatePushTarget, useDeletePushTarget, useUpdatePushTarget } from '../../src'
import { createTestUser, deleteTestUser, loginUser } from '../setup/helpers'
import { createQueryClient, createWrapper } from '../setup/wrapper'

describe('push target hooks', () => {
  let userId: string
  let email: string
  let password: string
  // const phone = '+12065551234'

  beforeAll(async () => {
    const user = await createTestUser({ name: 'UpdatePhone User' })
    userId = user.userId
    email = user.email
    password = user.password
  })

  afterAll(async () => {
    await deleteTestUser(userId)
  })

  test('useCreatePushTarget', async () => {
    const queryClient = createQueryClient()
    const wrapper = createWrapper({ queryClient })
    await loginUser(email, password, wrapper)

    const { result } = renderHook(() => useCreatePushTarget(), { wrapper })

    await act(async () => {
      await result.current.mutateAsync({
        targetId: 'test-push-target',
        identifier: 'push-token',
      })
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
  })

  test('useUpdatePushTarget', async () => {
    const queryClient = createQueryClient()
    const wrapper = createWrapper({ queryClient })
    await loginUser(email, password, wrapper)

    const { result } = renderHook(() => useUpdatePushTarget(), { wrapper })

    await act(async () => {
      await result.current.mutateAsync({
        targetId: 'test-push-target',
        identifier: 'new-push-token',
      })
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
  })

  test('useDeletePushTarget', async () => {
    const queryClient = createQueryClient()
    const wrapper = createWrapper({ queryClient })
    await loginUser(email, password, wrapper)

    const { result } = renderHook(() => useDeletePushTarget(), { wrapper })

    await act(async () => {
      await result.current.mutateAsync({
        targetId: 'test-push-target',
      })
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
  })
})
