import { act, renderHook, waitFor } from '@testing-library/react'
import { afterAll, beforeAll, describe, expect, test } from 'bun:test'

import {
  useInfiniteTableRows,
  useSuspenseTableRowsWithPagination,
  useTableRowsWithPagination,
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
}

describe('TablesDB pagination hooks', () => {
  const config = getTestConfig()
  const databaseId = config.databaseId
  // The test collection doubles as the test table for tablesDB hooks.
  const tableId = config.collectionId

  let userId: string
  let userEmail: string
  let userPassword: string
  const createdRowIds: string[] = []

  beforeAll(async () => {
    const user = await createTestUser({ name: 'TablesDB Pagination User' })
    userId = user.userId
    userEmail = user.email
    userPassword = user.password

    for (let i = 1; i <= 7; i++) {
      const row = await createTestDocument(
        { name: `Page Item ${i}`, age: i },
        `tablesdb-pagination-row-${i}`,
      )
      createdRowIds.push(row.$id)
    }
  })

  afterAll(async () => {
    for (const rowId of createdRowIds) {
      await deleteTestDocument(rowId).catch(() => {})
    }
    await deleteTestUser(userId)
  })

  describe('useTableRowsWithPagination', () => {
    test('returns first page of rows with correct limit', async () => {
      const wrapper = createWrapper()
      await loginUser(userEmail, userPassword, wrapper)

      const { result } = renderHook(
        () =>
          useTableRowsWithPagination<TestRowData>({
            databaseId,
            tableId,
            queries: [],
            limit: 3,
          }),
        { wrapper },
      )

      await waitFor(() => expect(result.current.documents.length).toBeGreaterThan(0))

      expect(result.current.documents.length).toBeLessThanOrEqual(3)
      expect(result.current.page).toBe(1)
      expect(result.current.hasPreviousPage).toBe(false)
    })

    test('hasNextPage is true when more rows exist', async () => {
      const wrapper = createWrapper()
      await loginUser(userEmail, userPassword, wrapper)

      const { result } = renderHook(
        () =>
          useTableRowsWithPagination<TestRowData>({
            databaseId,
            tableId,
            queries: [],
            limit: 3,
          }),
        { wrapper },
      )

      await waitFor(() => expect(result.current.documents.length).toBeGreaterThan(0))

      expect(result.current.hasNextPage).toBe(true)
      expect(result.current.total).toBeGreaterThanOrEqual(7)
    })

    test('nextPage advances to the next page', async () => {
      const wrapper = createWrapper()
      await loginUser(userEmail, userPassword, wrapper)

      const { result } = renderHook(
        () =>
          useTableRowsWithPagination<TestRowData>({
            databaseId,
            tableId,
            queries: [],
            limit: 3,
          }),
        { wrapper },
      )

      await waitFor(() => expect(result.current.documents.length).toBeGreaterThan(0))

      const firstPageDocs = [...result.current.documents]

      act(() => {
        result.current.nextPage()
      })

      expect(result.current.page).toBe(2)

      await waitFor(() => expect(result.current.documents.length).toBeGreaterThan(0))

      expect(result.current.hasPreviousPage).toBe(true)

      const secondPageIds = result.current.documents.map((d: any) => d._id)
      const firstPageIds = firstPageDocs.map((d: any) => d._id)
      const overlap = secondPageIds.filter((id: string) => firstPageIds.includes(id))
      expect(overlap.length).toBe(0)
    })

    test('previousPage goes back', async () => {
      const wrapper = createWrapper()
      await loginUser(userEmail, userPassword, wrapper)

      const { result } = renderHook(
        () =>
          useTableRowsWithPagination<TestRowData>({
            databaseId,
            tableId,
            queries: [],
            limit: 3,
          }),
        { wrapper },
      )

      await waitFor(() => expect(result.current.documents.length).toBeGreaterThan(0))

      act(() => {
        result.current.nextPage()
      })
      expect(result.current.page).toBe(2)

      act(() => {
        result.current.previousPage()
      })
      expect(result.current.page).toBe(1)
      expect(result.current.hasPreviousPage).toBe(false)
    })

    test('handlePageChange jumps to a specific page', async () => {
      const wrapper = createWrapper()
      await loginUser(userEmail, userPassword, wrapper)

      const { result } = renderHook(
        () =>
          useTableRowsWithPagination<TestRowData>({
            databaseId,
            tableId,
            queries: [],
            limit: 3,
          }),
        { wrapper },
      )

      await waitFor(() => expect(result.current.documents.length).toBeGreaterThan(0))

      act(() => {
        result.current.handlePageChange(3)
      })
      expect(result.current.page).toBe(3)

      await waitFor(() => expect(result.current.documents.length).toBeGreaterThanOrEqual(0))
    })

    test('handlePageChange ignores invalid page numbers', async () => {
      const wrapper = createWrapper()
      await loginUser(userEmail, userPassword, wrapper)

      const { result } = renderHook(
        () =>
          useTableRowsWithPagination<TestRowData>({
            databaseId,
            tableId,
            queries: [],
            limit: 3,
          }),
        { wrapper },
      )

      await waitFor(() => expect(result.current.documents.length).toBeGreaterThan(0))

      act(() => {
        result.current.handlePageChange(0)
      })
      expect(result.current.page).toBe(1)

      act(() => {
        result.current.handlePageChange(-1)
      })
      expect(result.current.page).toBe(1)
    })

    test('previousPage does nothing on first page', async () => {
      const wrapper = createWrapper()
      await loginUser(userEmail, userPassword, wrapper)

      const { result } = renderHook(
        () =>
          useTableRowsWithPagination<TestRowData>({
            databaseId,
            tableId,
            queries: [],
            limit: 3,
          }),
        { wrapper },
      )

      await waitFor(() => expect(result.current.documents.length).toBeGreaterThan(0))

      act(() => {
        result.current.previousPage()
      })
      expect(result.current.page).toBe(1)
    })

    test('exposes loading states', async () => {
      const wrapper = createWrapper()
      await loginUser(userEmail, userPassword, wrapper)

      const { result } = renderHook(
        () =>
          useTableRowsWithPagination<TestRowData>({
            databaseId,
            tableId,
            queries: [],
            limit: 3,
          }),
        { wrapper },
      )

      await waitFor(() => expect(result.current.isLoading).toBe(false))

      expect(result.current.isError).toBe(false)
      expect(result.current.error).toBeNull()
    })
  })

  describe('useSuspenseTableRowsWithPagination', () => {
    test('returns first page of rows with correct limit', async () => {
      const wrapper = createWrapper({ suspense: true })
      await loginUser(userEmail, userPassword, wrapper)

      const { result } = renderHook(
        () =>
          useSuspenseTableRowsWithPagination<TestRowData>({
            databaseId,
            tableId,
            queries: [],
            limit: 3,
          }),
        { wrapper },
      )

      await waitFor(() => expect(result.current.documents.length).toBeGreaterThan(0))

      expect(result.current.documents.length).toBeLessThanOrEqual(3)
      expect(result.current.page).toBe(1)
      expect(result.current.hasPreviousPage).toBe(false)
    })

    test('hasNextPage is true when more rows exist', async () => {
      const wrapper = createWrapper({ suspense: true })
      await loginUser(userEmail, userPassword, wrapper)

      const { result } = renderHook(
        () =>
          useSuspenseTableRowsWithPagination<TestRowData>({
            databaseId,
            tableId,
            queries: [],
            limit: 3,
          }),
        { wrapper },
      )

      await waitFor(() => expect(result.current.documents.length).toBeGreaterThan(0))

      expect(result.current.hasNextPage).toBe(true)
      expect(result.current.total).toBeGreaterThanOrEqual(7)
    })

    test('nextPage advances to the next page', async () => {
      const wrapper = createWrapper({ suspense: true })
      await loginUser(userEmail, userPassword, wrapper)

      const { result } = renderHook(
        () =>
          useSuspenseTableRowsWithPagination<TestRowData>({
            databaseId,
            tableId,
            queries: [],
            limit: 3,
          }),
        { wrapper },
      )

      await waitFor(() => expect(result.current.documents.length).toBeGreaterThan(0))

      const firstPageDocs = [...result.current.documents]

      act(() => {
        result.current.nextPage()
      })

      await waitFor(() => expect(result.current.page).toBe(2))
      await waitFor(() => expect(result.current.documents.length).toBeGreaterThan(0))

      expect(result.current.hasPreviousPage).toBe(true)

      const secondPageIds = result.current.documents.map((d: any) => d._id)
      const firstPageIds = firstPageDocs.map((d: any) => d._id)
      const overlap = secondPageIds.filter((id: string) => firstPageIds.includes(id))
      expect(overlap.length).toBe(0)
    })

    test('previousPage goes back', async () => {
      const wrapper = createWrapper({ suspense: true })
      await loginUser(userEmail, userPassword, wrapper)

      const { result } = renderHook(
        () =>
          useSuspenseTableRowsWithPagination<TestRowData>({
            databaseId,
            tableId,
            queries: [],
            limit: 3,
          }),
        { wrapper },
      )

      await waitFor(() => expect(result.current.documents.length).toBeGreaterThan(0))

      act(() => {
        result.current.nextPage()
      })
      await waitFor(() => expect(result.current.page).toBe(2))

      act(() => {
        result.current.previousPage()
      })
      await waitFor(() => expect(result.current.page).toBe(1))
      expect(result.current.hasPreviousPage).toBe(false)
    })

    test('handlePageChange jumps to a specific page', async () => {
      const wrapper = createWrapper({ suspense: true })
      await loginUser(userEmail, userPassword, wrapper)

      const { result } = renderHook(
        () =>
          useSuspenseTableRowsWithPagination<TestRowData>({
            databaseId,
            tableId,
            queries: [],
            limit: 3,
          }),
        { wrapper },
      )

      await waitFor(() => expect(result.current.documents.length).toBeGreaterThan(0))

      act(() => {
        result.current.handlePageChange(3)
      })
      await waitFor(() => expect(result.current.page).toBe(3))

      await waitFor(() => expect(result.current.documents.length).toBeGreaterThanOrEqual(0))
    })

    test('handlePageChange ignores invalid page numbers', async () => {
      const wrapper = createWrapper({ suspense: true })
      await loginUser(userEmail, userPassword, wrapper)

      const { result } = renderHook(
        () =>
          useSuspenseTableRowsWithPagination<TestRowData>({
            databaseId,
            tableId,
            queries: [],
            limit: 3,
          }),
        { wrapper },
      )

      await waitFor(() => expect(result.current.documents.length).toBeGreaterThan(0))

      act(() => {
        result.current.handlePageChange(0)
      })
      expect(result.current.page).toBe(1)

      act(() => {
        result.current.handlePageChange(-1)
      })
      expect(result.current.page).toBe(1)
    })

    test('previousPage does nothing on first page', async () => {
      const wrapper = createWrapper({ suspense: true })
      await loginUser(userEmail, userPassword, wrapper)

      const { result } = renderHook(
        () =>
          useSuspenseTableRowsWithPagination<TestRowData>({
            databaseId,
            tableId,
            queries: [],
            limit: 3,
          }),
        { wrapper },
      )

      await waitFor(() => expect(result.current.documents.length).toBeGreaterThan(0))

      act(() => {
        result.current.previousPage()
      })
      expect(result.current.page).toBe(1)
    })

    test('exposes loading states', async () => {
      const wrapper = createWrapper({ suspense: true })
      await loginUser(userEmail, userPassword, wrapper)

      const { result } = renderHook(
        () =>
          useSuspenseTableRowsWithPagination<TestRowData>({
            databaseId,
            tableId,
            queries: [],
            limit: 3,
          }),
        { wrapper },
      )

      await waitFor(() => expect(result.current.isLoading).toBe(false))

      expect(result.current.isError).toBe(false)
      expect(result.current.error).toBeNull()
    })
  })

  describe('useInfiniteTableRows', () => {
    test('returns first page of rows', async () => {
      const wrapper = createWrapper()
      await loginUser(userEmail, userPassword, wrapper)

      const { result } = renderHook(
        () =>
          useInfiniteTableRows<TestRowData>({
            databaseId,
            tableId,
            queries: [],
            limit: 3,
            subscribe: false,
          }),
        { wrapper },
      )

      await waitFor(() => expect(result.current.documents.length).toBeGreaterThan(0))

      expect(result.current.documents.length).toBeLessThanOrEqual(3)
      expect(result.current.hasNextPage).toBe(true)
      expect(result.current.total).toBeGreaterThanOrEqual(7)
    })

    test('fetchNextPage accumulates rows across pages', async () => {
      const wrapper = createWrapper()
      await loginUser(userEmail, userPassword, wrapper)

      const { result } = renderHook(
        () =>
          useInfiniteTableRows<TestRowData>({
            databaseId,
            tableId,
            queries: [],
            limit: 3,
            subscribe: false,
          }),
        { wrapper },
      )

      await waitFor(() => expect(result.current.documents.length).toBe(3))

      const firstPageCount = result.current.documents.length

      act(() => {
        result.current.fetchNextPage()
      })

      await waitFor(() => expect(result.current.documents.length).toBeGreaterThan(firstPageCount))

      expect(result.current.documents.length).toBe(6)
    })

    test('fetchNextPage does nothing when no more pages', async () => {
      const wrapper = createWrapper()
      await loginUser(userEmail, userPassword, wrapper)

      const { result } = renderHook(
        () =>
          useInfiniteTableRows<TestRowData>({
            databaseId,
            tableId,
            queries: [],
            limit: 100,
            subscribe: false,
          }),
        { wrapper },
      )

      await waitFor(() => expect(result.current.documents.length).toBeGreaterThan(0))

      expect(result.current.hasNextPage).toBe(false)

      const rowCount = result.current.documents.length

      act(() => {
        result.current.fetchNextPage()
      })

      expect(result.current.documents.length).toBe(rowCount)
    })

    test('isFetchingNextPage is true while loading a subsequent page', async () => {
      const wrapper = createWrapper()
      await loginUser(userEmail, userPassword, wrapper)

      const { result } = renderHook(
        () =>
          useInfiniteTableRows<TestRowData>({
            databaseId,
            tableId,
            queries: [],
            limit: 3,
            subscribe: false,
          }),
        { wrapper },
      )

      await waitFor(() => expect(result.current.documents.length).toBe(3))

      expect(result.current.isFetchingNextPage).toBe(false)

      act(() => {
        result.current.fetchNextPage()
      })

      await waitFor(() => expect(result.current.isFetchingNextPage).toBe(false))
      expect(result.current.documents.length).toBe(6)
    })

    test('reset clears accumulated rows and returns to page 1', async () => {
      const wrapper = createWrapper()
      await loginUser(userEmail, userPassword, wrapper)

      const { result } = renderHook(
        () =>
          useInfiniteTableRows<TestRowData>({
            databaseId,
            tableId,
            queries: [],
            limit: 3,
            subscribe: false,
          }),
        { wrapper },
      )

      await waitFor(() => expect(result.current.documents.length).toBe(3))

      act(() => {
        result.current.fetchNextPage()
      })

      await waitFor(() => expect(result.current.documents.length).toBe(6))

      act(() => {
        result.current.reset()
      })

      await waitFor(() => expect(result.current.documents.length).toBe(3))

      expect(result.current.documents.length).toBe(3)
      expect(result.current.hasNextPage).toBe(true)
    })

    test('exposes loading and error states', async () => {
      const wrapper = createWrapper()
      await loginUser(userEmail, userPassword, wrapper)

      const { result } = renderHook(
        () =>
          useInfiniteTableRows<TestRowData>({
            databaseId,
            tableId,
            queries: [],
            limit: 3,
            subscribe: false,
          }),
        { wrapper },
      )

      await waitFor(() => expect(result.current.isLoading).toBe(false))

      expect(result.current.isError).toBe(false)
      expect(result.current.error).toBeNull()
    })
  })
})
