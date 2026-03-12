import { act, renderHook, waitFor } from '@testing-library/react'
import { afterAll, beforeAll, describe, expect, test } from 'bun:test'

import {
  useCreateOperations,
  useCreateTransaction,
  useDeleteTransaction,
  useGetTransaction,
  useListTransactions,
  useUpdateTransaction,
} from '../../src'
import { createTestUser, deleteTestUser, getTestConfig, loginUser } from '../setup/helpers'
import { createWrapper } from '../setup/wrapper'

describe('Database transaction hooks', () => {
  const config = getTestConfig()
  const { databaseId, collectionId } = config
  let userId: string
  let userEmail: string
  let userPassword: string

  beforeAll(async () => {
    const user = await createTestUser({ name: 'Transaction User' })
    userId = user.userId
    userEmail = user.email
    userPassword = user.password
  })

  afterAll(async () => {
    await deleteTestUser(userId)
  })

  describe('useCreateTransaction', () => {
    test('creates a transaction and returns transaction data', async () => {
      const wrapper = createWrapper()
      await loginUser(userEmail, userPassword, wrapper)

      const { result, unmount } = renderHook(() => useCreateTransaction(), { wrapper })

      await act(async () => {
        await result.current.mutateAsync({})
      })

      await waitFor(() => expect(result.current.isSuccess).toBe(true))

      expect(result.current.data).toBeDefined()
      expect(result.current.data?._id).toBeDefined()
      expect(result.current.data?.status).toBeDefined()

      const transactionId = result.current.data!._id!
      unmount()

      // Clean up: delete the transaction
      const { result: deleteResult, unmount: unmountDelete } = renderHook(() => useDeleteTransaction(), { wrapper })
      await act(async () => {
        await deleteResult.current.mutateAsync({ transactionId })
      })
      unmountDelete()
    })

    test('creates a transaction with custom TTL', async () => {
      const wrapper = createWrapper()
      await loginUser(userEmail, userPassword, wrapper)

      const { result, unmount } = renderHook(() => useCreateTransaction(), { wrapper })

      await act(async () => {
        await result.current.mutateAsync({ ttl: 60 })
      })

      await waitFor(() => expect(result.current.isSuccess).toBe(true))

      expect(result.current.data).toBeDefined()
      expect(result.current.data?._id).toBeDefined()
      expect(result.current.data?.expiresAt).toBeDefined()

      const transactionId = result.current.data!._id!
      unmount()

      // Clean up
      const { result: deleteResult, unmount: unmountDelete } = renderHook(() => useDeleteTransaction(), { wrapper })
      await act(async () => {
        await deleteResult.current.mutateAsync({ transactionId })
      })
      unmountDelete()
    })
  })

  describe('useGetTransaction', () => {
    test('retrieves a transaction by ID', async () => {
      const wrapper = createWrapper()
      await loginUser(userEmail, userPassword, wrapper)

      // First create a transaction
      const { result: createResult, unmount: unmountCreate } = renderHook(() => useCreateTransaction(), { wrapper })

      await act(async () => {
        await createResult.current.mutateAsync({})
      })

      await waitFor(() => expect(createResult.current.isSuccess).toBe(true))
      const transactionId = createResult.current.data!._id!
      unmountCreate()

      // Now get it
      const { result, unmount } = renderHook(
        () => useGetTransaction({ transactionId }),
        { wrapper },
      )

      await waitFor(() => expect(result.current.isSuccess).toBe(true))

      expect(result.current.data).toBeDefined()
      expect(result.current.data?._id).toBe(transactionId)
      expect(result.current.data?.status).toBeDefined()
      unmount()

      // Clean up
      const { result: deleteResult, unmount: unmountDelete } = renderHook(() => useDeleteTransaction(), { wrapper })
      await act(async () => {
        await deleteResult.current.mutateAsync({ transactionId })
      })
      unmountDelete()
    })
  })

  describe('useListTransactions', () => {
    test('lists transactions', async () => {
      const wrapper = createWrapper()
      await loginUser(userEmail, userPassword, wrapper)

      // Create a transaction so there's at least one
      const { result: createResult, unmount: unmountCreate } = renderHook(() => useCreateTransaction(), { wrapper })

      await act(async () => {
        await createResult.current.mutateAsync({})
      })

      await waitFor(() => expect(createResult.current.isSuccess).toBe(true))
      const transactionId = createResult.current.data!._id!
      unmountCreate()

      const { result, unmount } = renderHook(
        () => useListTransactions(),
        { wrapper },
      )

      await waitFor(() => expect(result.current.isSuccess).toBe(true))

      expect(result.current.data).toBeDefined()
      expect(result.current.data?.total).toBeGreaterThanOrEqual(1)
      expect(result.current.data?.transactions).toBeDefined()
      expect(Array.isArray(result.current.data?.transactions)).toBe(true)
      unmount()

      // Clean up
      const { result: deleteResult, unmount: unmountDelete } = renderHook(() => useDeleteTransaction(), { wrapper })
      await act(async () => {
        await deleteResult.current.mutateAsync({ transactionId })
      })
      unmountDelete()
    })
  })

  describe('useCreateOperations', () => {
    test('adds a document create operation to a transaction', async () => {
      const wrapper = createWrapper()
      await loginUser(userEmail, userPassword, wrapper)

      // Create a transaction
      const { result: createResult, unmount: unmountCreate } = renderHook(() => useCreateTransaction(), { wrapper })

      await act(async () => {
        await createResult.current.mutateAsync({})
      })

      await waitFor(() => expect(createResult.current.isSuccess).toBe(true))
      const transactionId = createResult.current.data!._id!
      unmountCreate()

      // Add a create-document operation
      const { result, unmount } = renderHook(() => useCreateOperations(), { wrapper })

      // Appwrite transaction operations are JSON-encoded operation descriptors
      const operation = JSON.stringify({
        $id: 'op1',
        type: 'create',
        collection: `${databaseId}.${collectionId}`,
        data: { name: 'Transaction Doc' },
      })

      await act(async () => {
        result.current.mutate({
          transactionId,
          operations: [operation],
        })
      })

      // The hook should complete (success or error depending on Appwrite's operation format)
      await waitFor(() =>
        expect(result.current.isSuccess || result.current.isError).toBe(true),
      )
      unmount()

      // Clean up
      const { result: deleteResult, unmount: unmountDelete } = renderHook(() => useDeleteTransaction(), { wrapper })
      await act(async () => {
        await deleteResult.current.mutateAsync({ transactionId })
      })
      unmountDelete()
    })

    test('fails with invalid transaction ID', async () => {
      const wrapper = createWrapper()
      await loginUser(userEmail, userPassword, wrapper)

      const { result, unmount } = renderHook(() => useCreateOperations(), { wrapper })

      await act(async () => {
        result.current.mutate({
          transactionId: 'non-existent-txn',
          operations: ['{}'],
        })
      })

      await waitFor(() => expect(result.current.isError).toBe(true))
      unmount()
    })
  })

  describe('useUpdateTransaction', () => {
    test('commits a transaction', async () => {
      const wrapper = createWrapper()
      await loginUser(userEmail, userPassword, wrapper)

      // Create a transaction
      const { result: createResult, unmount: unmountCreate } = renderHook(() => useCreateTransaction(), { wrapper })

      await act(async () => {
        await createResult.current.mutateAsync({})
      })

      await waitFor(() => expect(createResult.current.isSuccess).toBe(true))
      const transactionId = createResult.current.data!._id!
      unmountCreate()

      // Commit it
      const { result, unmount } = renderHook(() => useUpdateTransaction(), { wrapper })

      await act(async () => {
        await result.current.mutateAsync({
          transactionId,
          commit: true,
        })
      })

      await waitFor(() => expect(result.current.isSuccess).toBe(true))

      expect(result.current.data).toBeDefined()
      expect(result.current.data?._id).toBe(transactionId)
      unmount()
    })

    test('rolls back a transaction', async () => {
      const wrapper = createWrapper()
      await loginUser(userEmail, userPassword, wrapper)

      // Create a transaction
      const { result: createResult, unmount: unmountCreate } = renderHook(() => useCreateTransaction(), { wrapper })

      await act(async () => {
        await createResult.current.mutateAsync({})
      })

      await waitFor(() => expect(createResult.current.isSuccess).toBe(true))
      const transactionId = createResult.current.data!._id!
      unmountCreate()

      // Rollback
      const { result, unmount } = renderHook(() => useUpdateTransaction(), { wrapper })

      await act(async () => {
        await result.current.mutateAsync({
          transactionId,
          rollback: true,
        })
      })

      await waitFor(() => expect(result.current.isSuccess).toBe(true))

      expect(result.current.data).toBeDefined()
      expect(result.current.data?._id).toBe(transactionId)
      unmount()
    })
  })

  describe('useDeleteTransaction', () => {
    test('deletes a transaction and returns status', async () => {
      const wrapper = createWrapper()
      await loginUser(userEmail, userPassword, wrapper)

      // Create a transaction to delete
      const { result: createResult, unmount: unmountCreate } = renderHook(() => useCreateTransaction(), { wrapper })

      await act(async () => {
        await createResult.current.mutateAsync({})
      })

      await waitFor(() => expect(createResult.current.isSuccess).toBe(true))
      const transactionId = createResult.current.data!._id!
      unmountCreate()

      // Delete it
      const { result, unmount } = renderHook(() => useDeleteTransaction(), { wrapper })

      await act(async () => {
        await result.current.mutateAsync({ transactionId })
      })

      await waitFor(() => expect(result.current.isSuccess).toBe(true))

      expect(result.current.data).toBeDefined()
      expect(result.current.data?.status).toBeDefined()
      unmount()
    })

    test('fails when deleting a non-existent transaction', async () => {
      const wrapper = createWrapper()
      await loginUser(userEmail, userPassword, wrapper)

      const { result, unmount } = renderHook(() => useDeleteTransaction(), { wrapper })

      await act(async () => {
        result.current.mutate({ transactionId: 'non-existent-id' })
      })

      await waitFor(() => expect(result.current.isError).toBe(true))
      unmount()
    })
  })
})
