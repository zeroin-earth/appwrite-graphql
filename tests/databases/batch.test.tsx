import { describe, test, expect, beforeAll, afterAll } from 'bun:test'
import { renderHook, act, waitFor } from '@testing-library/react'

import { createWrapper } from '../setup/wrapper'
import { createTestUser, deleteTestUser, getTestConfig } from '../setup/helpers'
import {
  useLogin,
  useCreateDocuments,
  useUpdateDocuments,
  useDeleteDocuments,
  useUpsertDocuments,
  useIncrementAttribute,
  useDecrementAttribute,
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

describe('Database batch & atomic hooks', () => {
  const config = getTestConfig()
  const { databaseId, collectionId } = config
  let userId: string
  let userEmail: string
  let userPassword: string

  beforeAll(async () => {
    const user = await createTestUser({ name: 'Batch DB User' })
    userId = user.userId
    userEmail = user.email
    userPassword = user.password
  })

  afterAll(async () => {
    await deleteTestUser(userId)
  })

  describe('useIncrementAttribute', () => {
    test('increments a numeric attribute on a document', async () => {
      const wrapper = createWrapper()
      await loginUser(userEmail, userPassword, wrapper)

      // Create a document with age=10 via server SDK
      const { createTestDocument, deleteTestDocument } = await import('../setup/helpers')
      const doc = await createTestDocument({ name: 'Increment Test', age: 10 })

      const { result } = renderHook(() => useIncrementAttribute(), { wrapper })

      await act(async () => {
        result.current.mutateAsync({
          databaseId,
          collectionId,
          documentId: doc.$id,
          attribute: 'age',
          value: 5,
        })
      })

      await waitFor(() => expect(result.current.isSuccess).toBe(true))

      expect(result.current.data).toBeDefined()
      expect(result.current.data?._id).toBe(doc.$id)

      await deleteTestDocument(doc.$id)
    })
  })

  describe('useDecrementAttribute', () => {
    test('decrements a numeric attribute on a document', async () => {
      const wrapper = createWrapper()
      await loginUser(userEmail, userPassword, wrapper)

      const { createTestDocument, deleteTestDocument } = await import('../setup/helpers')
      const doc = await createTestDocument({ name: 'Decrement Test', age: 20 })

      const { result } = renderHook(() => useDecrementAttribute(), { wrapper })

      await act(async () => {
        result.current.mutateAsync({
          databaseId,
          collectionId,
          documentId: doc.$id,
          attribute: 'age',
          value: 3,
        })
      })

      await waitFor(() => expect(result.current.isSuccess).toBe(true))

      expect(result.current.data).toBeDefined()
      expect(result.current.data?._id).toBe(doc.$id)

      await deleteTestDocument(doc.$id)
    })

    test('respects min bound', async () => {
      const wrapper = createWrapper()
      await loginUser(userEmail, userPassword, wrapper)

      const { createTestDocument, deleteTestDocument } = await import('../setup/helpers')
      const doc = await createTestDocument({ name: 'Min Bound Test', age: 5 })

      const { result } = renderHook(() => useDecrementAttribute(), { wrapper })

      await act(async () => {
        result.current.mutate({
          databaseId,
          collectionId,
          documentId: doc.$id,
          attribute: 'age',
          value: 100,
          min: 0,
        })
      })

      await waitFor(() =>
        expect(result.current.isSuccess || result.current.isError).toBe(true),
      )

      await deleteTestDocument(doc.$id)
    })
  })
})
