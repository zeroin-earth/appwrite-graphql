import { act, renderHook, waitFor } from '@testing-library/react'
import { afterAll, afterEach, beforeAll, describe, expect, test } from 'bun:test'

import { useCreateSubscriber, useDeleteSubscriber } from '../../src'
import { ID } from '../../src/types'
import {
  checkMail,
  createServerClient,
  createTestUser,
  deleteTestUser,
  emptyMail,
  getUserEmailTargetId,
  loginUser,
  sendTopicEmail,
} from '../setup/helpers'
import { createWrapper } from '../setup/wrapper'

const TOPIC_ID = 'test-topic'

describe('Subscriber hooks', () => {
  let userId: string
  let userEmail: string
  let userPassword: string
  let targetId: string

  beforeAll(async () => {
    const user = await createTestUser({ name: 'Subscriber Test User' })
    userId = user.userId
    userEmail = user.email
    userPassword = user.password
    targetId = await getUserEmailTargetId(userId)
  })

  afterAll(async () => {
    await deleteTestUser(userId)
  })

  afterEach(async () => {
    await emptyMail()
  })

  describe('useCreateSubscriber', () => {
    test('subscribes a user to a topic and returns subscriber data', async () => {
      const wrapper = createWrapper()
      await loginUser(userEmail, userPassword, wrapper)

      const { result } = renderHook(() => useCreateSubscriber(), { wrapper })

      const subscriberId = ID.unique()

      await act(async () => {
        await result.current.mutateAsync({
          subscriberId,
          topicId: TOPIC_ID,
          targetId,
        })
      })

      await waitFor(() => expect(result.current.isSuccess).toBe(true))

      expect(result.current.data).toBeDefined()
      expect(result.current.data?._id).toBe(subscriberId)
      expect(result.current.data?.topicId).toBe(TOPIC_ID)
      expect(result.current.data?.targetId).toBe(targetId)
      expect(result.current.data?.providerType).toBe('email')

      // Clean up subscription via server SDK
      const { messaging } = createServerClient()
      await messaging.deleteSubscriber({ topicId: TOPIC_ID, subscriberId })
    })

    test('receives an email after subscribing to a topic', async () => {
      const wrapper = createWrapper()
      await loginUser(userEmail, userPassword, wrapper)

      const { result } = renderHook(() => useCreateSubscriber(), { wrapper })

      const subscriberId = ID.unique()

      await act(async () => {
        await result.current.mutateAsync({
          subscriberId,
          topicId: TOPIC_ID,
          targetId,
        })
      })

      await waitFor(() => expect(result.current.isSuccess).toBe(true))

      // Send a message to the topic via server SDK
      await sendTopicEmail({
        topicId: TOPIC_ID,
        subject: 'Subscriber Hook Test',
        content: '<p>Hello from subscriber test</p>',
      })

      // Verify the email was received via Mailpit
      await waitFor(
        async () => {
          const emails = await checkMail()
          expect(emails.messages.length).toBeGreaterThan(0)
          expect(emails.messages[0].Subject).toBe('Subscriber Hook Test')
          return true
        },
        { timeout: 10000 },
      )

      // Clean up subscription via server SDK
      const { messaging } = createServerClient()
      await messaging.deleteSubscriber({ topicId: TOPIC_ID, subscriberId })
    })
  })

  describe('useDeleteSubscriber', () => {
    test('unsubscribes a user from a topic and returns status', async () => {
      const wrapper = createWrapper()
      await loginUser(userEmail, userPassword, wrapper)

      // First create a subscription
      const { result: createResult } = renderHook(() => useCreateSubscriber(), { wrapper })

      const subscriberId = ID.unique()

      await act(async () => {
        await createResult.current.mutateAsync({
          subscriberId,
          topicId: TOPIC_ID,
          targetId,
        })
      })

      await waitFor(() => expect(createResult.current.isSuccess).toBe(true))

      // Now delete the subscription
      const { result: deleteResult } = renderHook(() => useDeleteSubscriber(), { wrapper })

      await act(async () => {
        await deleteResult.current.mutateAsync({
          topicId: TOPIC_ID,
          subscriberId,
        })
      })

      await waitFor(() => expect(deleteResult.current.isSuccess).toBe(true))

      expect(deleteResult.current.data).toBeDefined()
      expect(deleteResult.current.data?.status).toBeDefined()
    })

    test('does not receive an email after unsubscribing from a topic', async () => {
      const wrapper = createWrapper()
      await loginUser(userEmail, userPassword, wrapper)

      // Subscribe
      const { result: createResult } = renderHook(() => useCreateSubscriber(), { wrapper })

      const subscriberId = ID.unique()

      await act(async () => {
        await createResult.current.mutateAsync({
          subscriberId,
          topicId: TOPIC_ID,
          targetId,
        })
      })

      await waitFor(() => expect(createResult.current.isSuccess).toBe(true))

      // Unsubscribe
      const { result: deleteResult } = renderHook(() => useDeleteSubscriber(), { wrapper })

      await act(async () => {
        await deleteResult.current.mutateAsync({
          topicId: TOPIC_ID,
          subscriberId,
        })
      })

      await waitFor(() => expect(deleteResult.current.isSuccess).toBe(true))

      // Send a message to the topic
      await sendTopicEmail({
        topicId: TOPIC_ID,
        subject: 'Should Not Arrive',
        content: '<p>This should not be delivered</p>',
      })

      // Wait a bit and verify no email was received
      await act(async () => {
        await new Promise((r) => setTimeout(r, 3000))
      })

      const emails = await checkMail()
      const matchingEmails = emails.messages?.filter((m: any) => m.Subject === 'Should Not Arrive')
      expect(matchingEmails?.length ?? 0).toBe(0)
    }, 30000)
  })
})
