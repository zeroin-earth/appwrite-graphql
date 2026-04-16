import { act, renderHook, waitFor } from '@testing-library/react'
import { afterAll, beforeAll, describe, expect, test } from 'bun:test'

import {
  Keys,
  useDecrementRowColumn,
  useDeleteRow,
  useIncrementRowColumn,
  useQueryClient,
  useRow,
  useUpdateRow,
  useUpsertRow,
} from '../../src'
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

describe('TablesDB optimistic update hooks', () => {
  const config = getTestConfig()
  const databaseId = config.databaseId
  // The test collection doubles as the test table for tablesDB hooks.
  const tableId = config.collectionId

  let userId: string
  let userEmail: string
  let userPassword: string
  const createdRowIds: string[] = []

  beforeAll(async () => {
    const user = await createTestUser({ name: 'TablesDB Optimistic User' })
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

  describe('useUpdateRow optimistic', () => {
    test('optimistically updates the row cache before server responds', async () => {
      const row = await createTestDocument({ name: 'Optimistic Update', age: 25 })
      createdRowIds.push(row.$id)

      const wrapper = createWrapper()
      await loginUser(userEmail, userPassword, wrapper)

      const { result: readResult } = renderHook(
        () => useRow<TestRowData>({ databaseId, tableId, rowId: row.$id }),
        { wrapper },
      )

      await waitFor(() => expect(readResult.current.isSuccess).toBe(true))
      expect(readResult.current.data?.name).toBe('Optimistic Update')

      const { result: queryClient } = renderHook(() => useQueryClient(), { wrapper })
      const { result: mutation } = renderHook(() => useUpdateRow(), { wrapper })

      await act(async () => {
        mutation.current.mutate({
          databaseId,
          tableId,
          rowId: row.$id,
          data: { name: 'Instantly Updated' },
        })
      })

      const entries = queryClient.current.getQueriesData({
        queryKey: Keys.tablesDB(databaseId).table(tableId).row(row.$id).key(),
      })

      expect(entries.length).toBeGreaterThan(0)
      const cachedRow = entries[0][1] as TestRowData | undefined

      expect(cachedRow?.name).toBe('Instantly Updated')
      expect(cachedRow?.age).toBe(25)

      await waitFor(() => expect(mutation.current.isSuccess).toBe(true))
    })

    test('preserves unmodified fields during optimistic update', async () => {
      const row = await createTestDocument({ name: 'Partial Update', age: 40, active: true })
      createdRowIds.push(row.$id)

      const wrapper = createWrapper()
      await loginUser(userEmail, userPassword, wrapper)

      const { result: readResult } = renderHook(
        () => useRow<TestRowData>({ databaseId, tableId, rowId: row.$id }),
        { wrapper },
      )

      await waitFor(() => expect(readResult.current.isSuccess).toBe(true))

      const { result: queryClient } = renderHook(() => useQueryClient(), { wrapper })
      const { result: mutation } = renderHook(() => useUpdateRow(), { wrapper })

      await act(async () => {
        mutation.current.mutate({
          databaseId,
          tableId,
          rowId: row.$id,
          data: { name: 'Only Name Changed' },
        })
      })

      const entries = queryClient.current.getQueriesData({
        queryKey: Keys.tablesDB(databaseId).table(tableId).row(row.$id).key(),
      })

      expect(entries.length).toBeGreaterThan(0)
      const cachedRow = entries[0][1] as TestRowData | undefined

      expect(cachedRow?.name).toBe('Only Name Changed')
      expect(cachedRow?.age).toBe(40)
      expect(cachedRow?.active).toBe(true)

      await waitFor(() => expect(mutation.current.isSuccess).toBe(true))
    })
  })

  describe('useDeleteRow optimistic', () => {
    test('optimistically removes row from cache', async () => {
      const row = await createTestDocument({ name: 'Optimistic Delete' })
      createdRowIds.push(row.$id)

      const wrapper = createWrapper()
      await loginUser(userEmail, userPassword, wrapper)

      const { result: readResult } = renderHook(
        () => useRow<TestRowData>({ databaseId, tableId, rowId: row.$id }),
        { wrapper },
      )

      await waitFor(() => expect(readResult.current.isSuccess).toBe(true))

      const { result: queryClient } = renderHook(() => useQueryClient(), { wrapper })

      const rowKeyPrefix = ['appwrite', 'tablesDB', databaseId, 'table', tableId, 'row', row.$id]

      const beforeEntries = queryClient.current.getQueriesData({ queryKey: rowKeyPrefix })
      expect(beforeEntries.length).toBeGreaterThan(0)

      const { result: mutation } = renderHook(() => useDeleteRow(), { wrapper })

      await act(async () => {
        mutation.current.mutate({ databaseId, tableId, rowId: row.$id })
      })

      const afterEntries = queryClient.current.getQueriesData({ queryKey: rowKeyPrefix })
      const hasData = afterEntries.some(([, data]) => data !== undefined)
      expect(hasData).toBe(false)

      await waitFor(() => expect(mutation.current.isSuccess).toBe(true))

      const idx = createdRowIds.indexOf(row.$id)
      if (idx !== -1) createdRowIds.splice(idx, 1)
    })
  })

  describe('useUpsertRow optimistic', () => {
    test('optimistically updates existing row cache', async () => {
      const row = await createTestDocument({ name: 'Optimistic Upsert', age: 50 })
      createdRowIds.push(row.$id)

      const wrapper = createWrapper()
      await loginUser(userEmail, userPassword, wrapper)

      const { result: readResult } = renderHook(
        () => useRow<TestRowData>({ databaseId, tableId, rowId: row.$id }),
        { wrapper },
      )

      await waitFor(() => expect(readResult.current.isSuccess).toBe(true))

      const { result: queryClient } = renderHook(() => useQueryClient(), { wrapper })
      const { result: mutation } = renderHook(() => useUpsertRow(), { wrapper })

      await act(async () => {
        mutation.current.mutate({
          databaseId,
          tableId,
          rowId: row.$id,
          data: { name: 'Upserted Instantly', age: 51 },
        })
      })

      const entries = queryClient.current.getQueriesData({
        queryKey: Keys.tablesDB(databaseId).table(tableId).row(row.$id).key(),
      })

      expect(entries.length).toBeGreaterThan(0)
      const cachedRow = entries[0][1] as TestRowData | undefined

      expect(cachedRow?.name).toBe('Upserted Instantly')
      expect(cachedRow?.age).toBe(51)

      await waitFor(() => expect(mutation.current.isSuccess).toBe(true))
    })
  })

  describe('useIncrementRowColumn optimistic', () => {
    test('optimistically increments the column in cache', async () => {
      const row = await createTestDocument({ name: 'Inc Test', age: 10 })
      createdRowIds.push(row.$id)

      const wrapper = createWrapper()
      await loginUser(userEmail, userPassword, wrapper)

      const { result: readResult } = renderHook(
        () => useRow<TestRowData>({ databaseId, tableId, rowId: row.$id }),
        { wrapper },
      )

      await waitFor(() => expect(readResult.current.isSuccess).toBe(true))
      expect(readResult.current.data?.age).toBe(10)

      const { result: queryClient } = renderHook(() => useQueryClient(), { wrapper })
      const { result: mutation } = renderHook(() => useIncrementRowColumn(), { wrapper })

      await act(async () => {
        mutation.current.mutate({
          databaseId,
          tableId,
          rowId: row.$id,
          column: 'age',
          value: 5,
        })
      })

      const incEntries = queryClient.current.getQueriesData({
        queryKey: Keys.tablesDB(databaseId).table(tableId).row(row.$id).key(),
      })

      expect(incEntries.length).toBeGreaterThan(0)
      const incCachedRow = incEntries[0][1] as TestRowData | undefined

      expect(incCachedRow?.age).toBe(15)

      await waitFor(() => expect(mutation.current.isSuccess || mutation.current.isError).toBe(true))
    })

    test('respects max ceiling in optimistic update', async () => {
      const row = await createTestDocument({ name: 'Max Test', age: 95 })
      createdRowIds.push(row.$id)

      const wrapper = createWrapper()
      await loginUser(userEmail, userPassword, wrapper)

      const { result: readResult } = renderHook(
        () => useRow<TestRowData>({ databaseId, tableId, rowId: row.$id }),
        { wrapper },
      )

      await waitFor(() => expect(readResult.current.isSuccess).toBe(true))

      const { result: queryClient } = renderHook(() => useQueryClient(), { wrapper })
      const { result: mutation } = renderHook(() => useIncrementRowColumn(), { wrapper })

      await act(async () => {
        mutation.current.mutate({
          databaseId,
          tableId,
          rowId: row.$id,
          column: 'age',
          value: 10,
          max: 100,
        })
      })

      const maxEntries = queryClient.current.getQueriesData({
        queryKey: Keys.tablesDB(databaseId).table(tableId).row(row.$id).key(),
      })

      expect(maxEntries.length).toBeGreaterThan(0)
      const maxCachedRow = maxEntries[0][1] as TestRowData | undefined

      // 95 + 10 = 105, but max is 100
      expect(maxCachedRow?.age).toBe(100)

      await waitFor(() => expect(mutation.current.isSuccess || mutation.current.isError).toBe(true))
    })
  })

  describe('useDecrementRowColumn optimistic', () => {
    test('optimistically decrements the column in cache', async () => {
      const row = await createTestDocument({ name: 'Dec Test', age: 20 })
      createdRowIds.push(row.$id)

      const wrapper = createWrapper()
      await loginUser(userEmail, userPassword, wrapper)

      const { result: readResult } = renderHook(
        () => useRow<TestRowData>({ databaseId, tableId, rowId: row.$id }),
        { wrapper },
      )

      await waitFor(() => expect(readResult.current.isSuccess).toBe(true))
      expect(readResult.current.data?.age).toBe(20)

      const { result: queryClient } = renderHook(() => useQueryClient(), { wrapper })
      const { result: mutation } = renderHook(() => useDecrementRowColumn(), { wrapper })

      await act(async () => {
        mutation.current.mutate({
          databaseId,
          tableId,
          rowId: row.$id,
          column: 'age',
          value: 7,
        })
      })

      const decEntries = queryClient.current.getQueriesData({
        queryKey: Keys.tablesDB(databaseId).table(tableId).row(row.$id).key(),
      })

      expect(decEntries.length).toBeGreaterThan(0)
      const decCachedRow = decEntries[0][1] as TestRowData | undefined

      expect(decCachedRow?.age).toBe(13)

      await waitFor(() => expect(mutation.current.isSuccess || mutation.current.isError).toBe(true))
    })

    test('respects min floor in optimistic update', async () => {
      const row = await createTestDocument({ name: 'Min Test', age: 3 })
      createdRowIds.push(row.$id)

      const wrapper = createWrapper()
      await loginUser(userEmail, userPassword, wrapper)

      const { result: readResult } = renderHook(
        () => useRow<TestRowData>({ databaseId, tableId, rowId: row.$id }),
        { wrapper },
      )

      await waitFor(() => expect(readResult.current.isSuccess).toBe(true))

      const { result: queryClient } = renderHook(() => useQueryClient(), { wrapper })
      const { result: mutation } = renderHook(() => useDecrementRowColumn(), { wrapper })

      await act(async () => {
        mutation.current.mutate({
          databaseId,
          tableId,
          rowId: row.$id,
          column: 'age',
          value: 10,
          min: 0,
        })
      })

      const minEntries = queryClient.current.getQueriesData({
        queryKey: Keys.tablesDB(databaseId).table(tableId).row(row.$id).key(),
      })

      expect(minEntries.length).toBeGreaterThan(0)
      const minCachedRow = minEntries[0][1] as TestRowData | undefined

      // 3 - 10 = -7, but min is 0
      expect(minCachedRow?.age).toBe(0)

      await waitFor(() => expect(mutation.current.isSuccess || mutation.current.isError).toBe(true))
    })
  })
})
