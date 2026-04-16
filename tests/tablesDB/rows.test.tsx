import { act, renderHook, waitFor } from '@testing-library/react'
import { Channel } from 'appwrite'
import { afterAll, beforeAll, describe, expect, spyOn, test } from 'bun:test'

import {
  useCreateRow,
  useDeleteRow,
  useQueryClient,
  useRow,
  useSuspenseRow,
  useSuspenseTableRows,
  useTableRows,
  useUpdateRow,
  useUpsertRow,
} from '../../src'
import { ID } from '../../src/types'
import { triggerRealtimeEvent } from '../__mocks__/Realtime'
import {
  createTestDocument,
  createTestUser,
  deleteTestDocument,
  deleteTestUser,
  getTestConfig,
  loginUser,
} from '../setup/helpers'
import { createWrapper } from '../setup/wrapper'

interface TestRowData {
  name: string
  age?: number
  active?: boolean
}

describe('TablesDB row hooks', () => {
  const config = getTestConfig()
  const databaseId = config.databaseId
  // The server's tablesDB namespace addresses tables by the same IDs used for
  // collections in the legacy databases namespace — the test collection doubles
  // as a test table.
  const tableId = config.collectionId

  let userId: string
  let userEmail: string
  let userPassword: string
  const createdRowIds: string[] = []

  beforeAll(async () => {
    const user = await createTestUser({ name: 'TablesDB Row User' })
    userId = user.userId
    userEmail = user.email
    userPassword = user.password
  })

  afterAll(async () => {
    for (const rowId of createdRowIds) {
      await deleteTestDocument(rowId).catch(() => {})
    }
    await deleteTestUser(userId)
  })

  describe('useCreateRow', () => {
    test('creates a row and returns its _id', async () => {
      const wrapper = createWrapper()
      await loginUser(userEmail, userPassword, wrapper)

      const { result } = renderHook(() => useCreateRow(), { wrapper })
      const rowId = ID.unique()

      await act(async () => {
        await result.current.mutateAsync({
          databaseId,
          tableId,
          rowId,
          data: { name: 'Row One', age: 22 },
        })
      })

      await waitFor(() => expect(result.current.isSuccess).toBe(true))
      createdRowIds.push(rowId)
      expect(result.current.data?._id).toBe(rowId)
    })

    test('creates a row with all optional fields including permissions', async () => {
      const wrapper = createWrapper()
      await loginUser(userEmail, userPassword, wrapper)

      const { result } = renderHook(() => useCreateRow(), { wrapper })
      const rowId = ID.unique()

      await act(async () => {
        await result.current.mutateAsync({
          databaseId,
          tableId,
          rowId,
          data: { name: 'Full Row', age: 30, active: true },
        })
      })

      await waitFor(() => expect(result.current.isSuccess).toBe(true))
      createdRowIds.push(rowId)
      expect(result.current.data).toBeDefined()
      expect(result.current.data?._id).toBe(rowId)
    })

    test('fails when required "name" field is missing', async () => {
      const wrapper = createWrapper()
      await loginUser(userEmail, userPassword, wrapper)

      const { result } = renderHook(() => useCreateRow(), { wrapper })

      await act(async () => {
        result.current.mutate({
          databaseId,
          tableId,
          rowId: ID.unique(),
          data: { age: 10 },
        })
      })

      await waitFor(() => expect(result.current.isError).toBe(true))
    })
  })

  describe('useRow', () => {
    let rowId: string

    beforeAll(async () => {
      const row = await createTestDocument({ name: 'Fetched Row', age: 31 })
      rowId = row.$id
      createdRowIds.push(rowId)
    })

    test('fetches a row by ID', async () => {
      const wrapper = createWrapper()
      await loginUser(userEmail, userPassword, wrapper)

      const { result } = renderHook(() => useRow<TestRowData>({ databaseId, tableId, rowId }), {
        wrapper,
      })

      await waitFor(() => expect(result.current.isSuccess).toBe(true))
      expect((result.current.data as any)?._id).toBe(rowId)
      expect(result.current.data?.name).toBe('Fetched Row')
      expect(result.current.data?.age).toBe(31)
    })

    test('returns parsed JSON data fields spread onto the row', async () => {
      const wrapper = createWrapper()
      await loginUser(userEmail, userPassword, wrapper)

      const { result } = renderHook(() => useRow<TestRowData>({ databaseId, tableId, rowId }), {
        wrapper,
      })

      await waitFor(() => expect(result.current.isSuccess).toBe(true))
      expect(result.current.data?.name).toEqual('Fetched Row')
      expect(result.current.data?.age).toEqual(31)
    })
  })

  describe('useSuspenseRow', () => {
    let rowId: string

    beforeAll(async () => {
      const row = await createTestDocument({ name: 'Suspense Row', age: 55, active: true })
      rowId = row.$id
      createdRowIds.push(rowId)
    })

    test('loads a row under suspense boundary', async () => {
      const wrapper = createWrapper({ suspense: true })
      await loginUser(userEmail, userPassword, wrapper)

      const { result } = renderHook(
        () => useSuspenseRow<TestRowData>({ databaseId, tableId, rowId }),
        { wrapper },
      )

      await waitFor(() => expect(result.current.data).toBeDefined())
      expect((result.current.data as any)?._id).toBe(rowId)
      expect(result.current.data?.name).toBe('Suspense Row')
      expect(result.current.data?.age).toBe(55)
    })

    test('is listening for realtime updates', async () => {
      const wrapper = createWrapper({ suspense: true })
      await loginUser(userEmail, userPassword, wrapper)

      const { result: queryClient } = renderHook(() => useQueryClient(), { wrapper })
      const spy = spyOn(queryClient.current, 'setQueryData')

      const { result } = renderHook(
        () => useSuspenseRow<TestRowData>({ databaseId, tableId, rowId }),
        { wrapper },
      )

      await waitFor(() => expect(result.current.data).toBeDefined())

      triggerRealtimeEvent(
        Channel.tablesdb(databaseId).table(tableId).row(rowId).update(),
        {
          _id: rowId,
          name: 'Realtime Updated',
          age: 56,
        },
        [`databases.${databaseId}.collections.${tableId}.documents.${rowId}.update`],
      )

      expect(spy).toHaveBeenCalledWith(
        ['appwrite', 'tablesDB', databaseId, 'table', tableId, 'row', rowId],
        expect.objectContaining({ name: 'Realtime Updated' }),
      )
    })
  })

  describe('useTableRows', () => {
    beforeAll(async () => {
      const row = await createTestDocument({ name: 'List Row', age: 5 })
      createdRowIds.push(row.$id)
    })

    test('lists rows in a table', async () => {
      const wrapper = createWrapper()
      await loginUser(userEmail, userPassword, wrapper)

      const { result } = renderHook(
        () => useTableRows<TestRowData>({ databaseId, tableId, subscribe: false }),
        { wrapper },
      )

      await waitFor(() => expect(result.current.isSuccess).toBe(true))
      expect(Array.isArray(result.current.documents)).toBe(true)
      expect(typeof result.current.total).toBe('number')
    })

    test('realtime create event sets row cache and invalidates list', async () => {
      const wrapper = createWrapper()
      await loginUser(userEmail, userPassword, wrapper)

      const { result: queryClient } = renderHook(() => useQueryClient(), { wrapper })
      const spy = spyOn(queryClient.current, 'setQueryData')

      const { result } = renderHook(
        () => useTableRows<TestRowData>({ databaseId, tableId, subscribe: true }),
        { wrapper },
      )

      await waitFor(() => expect(result.current.isSuccess).toBe(true))

      const newRowId = ID.unique()
      triggerRealtimeEvent(
        Channel.tablesdb(databaseId).table(tableId).row(),
        { $id: newRowId, name: 'New Row', age: 1 },
        [`databases.${databaseId}.collections.${tableId}.documents.${newRowId}.create`],
      )

      expect(spy).toHaveBeenCalledWith(
        ['appwrite', 'tablesDB', databaseId, 'table', tableId, 'row', newRowId],
        expect.objectContaining({ name: 'New Row' }),
      )
    })

    test('realtime update event sets row cache and invalidates list', async () => {
      const wrapper = createWrapper()
      await loginUser(userEmail, userPassword, wrapper)

      const { result: queryClient } = renderHook(() => useQueryClient(), { wrapper })
      const spy = spyOn(queryClient.current, 'setQueryData')

      const { result } = renderHook(
        () => useTableRows<TestRowData>({ databaseId, tableId, subscribe: true }),
        { wrapper },
      )

      await waitFor(() => expect(result.current.isSuccess).toBe(true))

      const existingRowId = ID.unique()
      triggerRealtimeEvent(
        Channel.tablesdb(databaseId).table(tableId).row(),
        { $id: existingRowId, name: 'Updated Row', age: 2 },
        [`databases.${databaseId}.collections.${tableId}.documents.${existingRowId}.update`],
      )

      expect(spy).toHaveBeenCalledWith(
        ['appwrite', 'tablesDB', databaseId, 'table', tableId, 'row', existingRowId],
        expect.objectContaining({ name: 'Updated Row' }),
      )
    })

    test('realtime delete event sets row cache and invalidates list', async () => {
      const wrapper = createWrapper()
      await loginUser(userEmail, userPassword, wrapper)

      const { result: queryClient } = renderHook(() => useQueryClient(), { wrapper })
      const spy = spyOn(queryClient.current, 'setQueryData')

      const { result } = renderHook(
        () => useTableRows<TestRowData>({ databaseId, tableId, subscribe: true }),
        { wrapper },
      )

      await waitFor(() => expect(result.current.isSuccess).toBe(true))

      const deletedRowId = ID.unique()
      triggerRealtimeEvent(
        Channel.tablesdb(databaseId).table(tableId).row(),
        { $id: deletedRowId, name: 'Deleted Row', age: 3 },
        [`databases.${databaseId}.collections.${tableId}.documents.${deletedRowId}.delete`],
      )

      expect(spy).toHaveBeenCalledWith(
        ['appwrite', 'tablesDB', databaseId, 'table', tableId, 'row', deletedRowId],
        expect.objectContaining({ name: 'Deleted Row' }),
      )
    })
  })

  describe('useSuspenseTableRows', () => {
    test('lists rows under suspense boundary', async () => {
      const wrapper = createWrapper({ suspense: true })
      await loginUser(userEmail, userPassword, wrapper)

      const { result } = renderHook(
        () => useSuspenseTableRows<TestRowData>({ databaseId, tableId, subscribe: false }),
        { wrapper },
      )

      await waitFor(() => expect(result.current.documents).toBeDefined())
      expect(Array.isArray(result.current.documents)).toBe(true)
      expect(typeof result.current.total).toBe('number')
    })
  })

  describe('useUpdateRow', () => {
    let rowId: string

    beforeAll(async () => {
      const row = await createTestDocument({ name: 'Pre Update', age: 10 })
      rowId = row.$id
      createdRowIds.push(rowId)
    })

    test('updates a row (sparse) and preserves untouched fields', async () => {
      const wrapper = createWrapper()
      await loginUser(userEmail, userPassword, wrapper)

      const { result } = renderHook(() => useUpdateRow(), { wrapper })

      await act(async () => {
        await result.current.mutateAsync({
          databaseId,
          tableId,
          rowId,
          data: { name: 'Post Update' },
        })
      })

      await waitFor(() => expect(result.current.isSuccess).toBe(true))

      const { result: readResult } = renderHook(
        () => useRow<TestRowData>({ databaseId, tableId, rowId }),
        { wrapper },
      )

      await waitFor(() => expect(readResult.current.isSuccess).toBe(true))
      expect(readResult.current.data?.name).toBe('Post Update')
      expect(readResult.current.data?.age).toBe(10)
    })

    test('fails when updating with a bogus rowId', async () => {
      const wrapper = createWrapper()
      await loginUser(userEmail, userPassword, wrapper)

      const { result } = renderHook(() => useUpdateRow(), { wrapper })

      await act(async () => {
        result.current.mutate({
          databaseId,
          tableId,
          rowId: 'non-existent-row-id',
          data: { name: 'Should Fail' },
        })
      })

      await waitFor(() => expect(result.current.isError).toBe(true))
    })
  })

  describe('useUpsertRow', () => {
    test('creates a new row via upsert when it does not exist', async () => {
      const wrapper = createWrapper()
      await loginUser(userEmail, userPassword, wrapper)

      const rowId = ID.unique()
      const { result } = renderHook(() => useUpsertRow(), { wrapper })

      await act(async () => {
        await result.current.mutateAsync({
          databaseId,
          tableId,
          rowId,
          data: { name: 'Upsert New', age: 40 },
        })
      })

      await waitFor(() => expect(result.current.isSuccess).toBe(true))
      createdRowIds.push(rowId)
      expect(result.current.data?._id).toBe(rowId)
    })

    test('updates an existing row via upsert', async () => {
      const wrapper = createWrapper()
      await loginUser(userEmail, userPassword, wrapper)

      const existingRow = await createTestDocument({ name: 'Upsert Existing', age: 40 })
      const existingRowId = existingRow.$id
      createdRowIds.push(existingRowId)

      const { result } = renderHook(() => useUpsertRow(), { wrapper })

      await act(async () => {
        await result.current.mutateAsync({
          databaseId,
          tableId,
          rowId: existingRowId,
          data: { name: 'Upsert Updated', age: 41 },
        })
      })

      await waitFor(() => expect(result.current.isSuccess).toBe(true))
      expect(result.current.data?._id).toBe(existingRowId)
    })
  })

  describe('useDeleteRow', () => {
    test('deletes a row successfully', async () => {
      const wrapper = createWrapper()
      await loginUser(userEmail, userPassword, wrapper)

      const row = await createTestDocument({ name: 'To Delete', age: 99 })
      const { result } = renderHook(() => useDeleteRow(), { wrapper })

      await act(async () => {
        await result.current.mutateAsync({ databaseId, tableId, rowId: row.$id })
      })

      await waitFor(() => expect(result.current.isSuccess).toBe(true))
      expect(result.current.data?.status).toBeDefined()
    })

    test('fails when deleting a non-existent row', async () => {
      const wrapper = createWrapper()
      await loginUser(userEmail, userPassword, wrapper)

      const { result } = renderHook(() => useDeleteRow(), { wrapper })

      await act(async () => {
        result.current.mutate({ databaseId, tableId, rowId: 'non-existent-row-id' })
      })

      await waitFor(() => expect(result.current.isError).toBe(true))
    })
  })
})
