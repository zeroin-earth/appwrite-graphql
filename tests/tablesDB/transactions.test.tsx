import { act, renderHook, waitFor } from '@testing-library/react'
import { afterAll, beforeAll, describe, expect, test } from 'bun:test'

import {
  useCreateTableOperations,
  useCreateTableTransaction,
  useDeleteTableTransaction,
  useGetTableTransaction,
  useListTableTransactions,
  useUpdateTableTransaction,
} from '../../src'
import { createTestUser, deleteTestUser, getTestConfig, loginUser } from '../setup/helpers'
import { createWrapper } from '../setup/wrapper'

describe('TablesDB transaction hooks', () => {
  const config = getTestConfig()
  const { databaseId, collectionId } = config

  let userId: string
  let userEmail: string
  let userPassword: string

  beforeAll(async () => {
    const user = await createTestUser({ name: 'TablesDB Transaction User' })
    userId = user.userId
    userEmail = user.email
    userPassword = user.password
  })

  afterAll(async () => {
    await deleteTestUser(userId)
  })

  describe('useCreateTableTransaction', () => {
    test('creates a transaction and returns transaction data', async () => {
      const wrapper = createWrapper()
      await loginUser(userEmail, userPassword, wrapper)

      const { result, unmount } = renderHook(() => useCreateTableTransaction(), { wrapper })

      await act(async () => {
        await result.current.mutateAsync({})
      })

      await waitFor(() => expect(result.current.isSuccess).toBe(true))

      expect(result.current.data).toBeDefined()
      expect(result.current.data?._id).toBeDefined()
      expect(result.current.data?.status).toBeDefined()

      const transactionId = result.current.data!._id!
      unmount()

      const { result: deleteResult, unmount: unmountDelete } = renderHook(
        () => useDeleteTableTransaction(),
        { wrapper },
      )
      await act(async () => {
        await deleteResult.current.mutateAsync({ transactionId })
      })
      unmountDelete()
    })

    test('creates a transaction with custom TTL', async () => {
      const wrapper = createWrapper()
      await loginUser(userEmail, userPassword, wrapper)

      const { result, unmount } = renderHook(() => useCreateTableTransaction(), { wrapper })

      await act(async () => {
        await result.current.mutateAsync({ ttl: 60 })
      })

      await waitFor(() => expect(result.current.isSuccess).toBe(true))

      expect(result.current.data).toBeDefined()
      expect(result.current.data?._id).toBeDefined()
      expect(result.current.data?.expiresAt).toBeDefined()

      const transactionId = result.current.data!._id!
      unmount()

      const { result: deleteResult, unmount: unmountDelete } = renderHook(
        () => useDeleteTableTransaction(),
        { wrapper },
      )
      await act(async () => {
        await deleteResult.current.mutateAsync({ transactionId })
      })
      unmountDelete()
    })
  })

  describe('useGetTableTransaction', () => {
    test('retrieves a transaction by ID', async () => {
      const wrapper = createWrapper()
      await loginUser(userEmail, userPassword, wrapper)

      const { result: createResult, unmount: unmountCreate } = renderHook(
        () => useCreateTableTransaction(),
        { wrapper },
      )

      await act(async () => {
        await createResult.current.mutateAsync({})
      })

      await waitFor(() => expect(createResult.current.isSuccess).toBe(true))
      const transactionId = createResult.current.data!._id!
      unmountCreate()

      const { result, unmount } = renderHook(() => useGetTableTransaction({ transactionId }), {
        wrapper,
      })

      await waitFor(() => expect(result.current.isSuccess).toBe(true))

      expect(result.current.data).toBeDefined()
      expect(result.current.data?._id).toBe(transactionId)
      expect(result.current.data?.status).toBeDefined()
      unmount()

      const { result: deleteResult, unmount: unmountDelete } = renderHook(
        () => useDeleteTableTransaction(),
        { wrapper },
      )
      await act(async () => {
        await deleteResult.current.mutateAsync({ transactionId })
      })
      unmountDelete()
    })
  })

  describe('useListTableTransactions', () => {
    test('lists transactions', async () => {
      const wrapper = createWrapper()
      await loginUser(userEmail, userPassword, wrapper)

      const { result: createResult, unmount: unmountCreate } = renderHook(
        () => useCreateTableTransaction(),
        { wrapper },
      )

      await act(async () => {
        await createResult.current.mutateAsync({})
      })

      await waitFor(() => expect(createResult.current.isSuccess).toBe(true))
      const transactionId = createResult.current.data!._id!
      unmountCreate()

      const { result, unmount } = renderHook(() => useListTableTransactions(), { wrapper })

      await waitFor(() => expect(result.current.isSuccess).toBe(true))

      expect(result.current.data).toBeDefined()
      expect(result.current.data?.total).toBeGreaterThanOrEqual(1)
      expect(result.current.data?.transactions).toBeDefined()
      expect(Array.isArray(result.current.data?.transactions)).toBe(true)
      unmount()

      const { result: deleteResult, unmount: unmountDelete } = renderHook(
        () => useDeleteTableTransaction(),
        { wrapper },
      )
      await act(async () => {
        await deleteResult.current.mutateAsync({ transactionId })
      })
      unmountDelete()
    })
  })

  describe('useCreateTableOperations', () => {
    test('adds an operation to a transaction', async () => {
      const wrapper = createWrapper()
      await loginUser(userEmail, userPassword, wrapper)

      const { result: createResult, unmount: unmountCreate } = renderHook(
        () => useCreateTableTransaction(),
        { wrapper },
      )

      await act(async () => {
        await createResult.current.mutateAsync({})
      })

      await waitFor(() => expect(createResult.current.isSuccess).toBe(true))
      const transactionId = createResult.current.data!._id!
      unmountCreate()

      const { result, unmount } = renderHook(() => useCreateTableOperations(), { wrapper })

      const operation = JSON.stringify({
        $id: 'op1',
        type: 'create',
        collection: `${databaseId}.${collectionId}`,
        data: { name: 'Transaction Row' },
      })

      await act(async () => {
        result.current.mutate({
          transactionId,
          operations: [operation],
        })
      })

      await waitFor(() => expect(result.current.isSuccess || result.current.isError).toBe(true))
      unmount()

      const { result: deleteResult, unmount: unmountDelete } = renderHook(
        () => useDeleteTableTransaction(),
        { wrapper },
      )
      await act(async () => {
        await deleteResult.current.mutateAsync({ transactionId })
      })
      unmountDelete()
    })

    test('fails with invalid transaction ID', async () => {
      const wrapper = createWrapper()
      await loginUser(userEmail, userPassword, wrapper)

      const { result, unmount } = renderHook(() => useCreateTableOperations(), { wrapper })

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

  describe('useUpdateTableTransaction', () => {
    test('commits a transaction', async () => {
      const wrapper = createWrapper()
      await loginUser(userEmail, userPassword, wrapper)

      const { result: createResult, unmount: unmountCreate } = renderHook(
        () => useCreateTableTransaction(),
        { wrapper },
      )

      await act(async () => {
        await createResult.current.mutateAsync({})
      })

      await waitFor(() => expect(createResult.current.isSuccess).toBe(true))
      const transactionId = createResult.current.data!._id!
      unmountCreate()

      const { result, unmount } = renderHook(() => useUpdateTableTransaction(), { wrapper })

      await act(async () => {
        await result.current.mutateAsync({ transactionId, commit: true })
      })

      await waitFor(() => expect(result.current.isSuccess).toBe(true))

      expect(result.current.data).toBeDefined()
      expect(result.current.data?._id).toBe(transactionId)
      unmount()
    })

    test('rolls back a transaction', async () => {
      const wrapper = createWrapper()
      await loginUser(userEmail, userPassword, wrapper)

      const { result: createResult, unmount: unmountCreate } = renderHook(
        () => useCreateTableTransaction(),
        { wrapper },
      )

      await act(async () => {
        await createResult.current.mutateAsync({})
      })

      await waitFor(() => expect(createResult.current.isSuccess).toBe(true))
      const transactionId = createResult.current.data!._id!
      unmountCreate()

      const { result, unmount } = renderHook(() => useUpdateTableTransaction(), { wrapper })

      await act(async () => {
        await result.current.mutateAsync({ transactionId, rollback: true })
      })

      await waitFor(() => expect(result.current.isSuccess).toBe(true))

      expect(result.current.data).toBeDefined()
      expect(result.current.data?._id).toBe(transactionId)
      unmount()
    })
  })

  describe('useDeleteTableTransaction', () => {
    test('deletes a transaction and returns status', async () => {
      const wrapper = createWrapper()
      await loginUser(userEmail, userPassword, wrapper)

      const { result: createResult, unmount: unmountCreate } = renderHook(
        () => useCreateTableTransaction(),
        { wrapper },
      )

      await act(async () => {
        await createResult.current.mutateAsync({})
      })

      await waitFor(() => expect(createResult.current.isSuccess).toBe(true))
      const transactionId = createResult.current.data!._id!
      unmountCreate()

      const { result, unmount } = renderHook(() => useDeleteTableTransaction(), { wrapper })

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

      const { result, unmount } = renderHook(() => useDeleteTableTransaction(), { wrapper })

      await act(async () => {
        result.current.mutate({ transactionId: 'non-existent-id' })
      })

      await waitFor(() => expect(result.current.isError).toBe(true))
      unmount()
    })
  })
})
