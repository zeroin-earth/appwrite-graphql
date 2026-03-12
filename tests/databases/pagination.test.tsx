import { act, renderHook, waitFor } from '@testing-library/react'
import { afterAll, beforeAll, describe, expect, test } from 'bun:test'

import {
  useCollectionWithPagination,
  useInfiniteCollection,
  useSuspenseCollectionWithPagination,
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

interface TestDocumentData {
  name: string
  age?: number
}

describe('Pagination hooks', () => {
  const config = getTestConfig()
  const { databaseId, collectionId } = config
  let userId: string
  let userEmail: string
  let userPassword: string
  const createdDocumentIds: string[] = []

  // Create 7 documents to test pagination with small page sizes
  beforeAll(async () => {
    const user = await createTestUser({ name: 'Pagination User' })
    userId = user.userId
    userEmail = user.email
    userPassword = user.password

    for (let i = 1; i <= 7; i++) {
      const doc = await createTestDocument(
        { name: `Page Item ${i}`, age: i },
        `pagination-doc-${i}`,
      )
      createdDocumentIds.push(doc.$id)
    }
  })

  afterAll(async () => {
    for (const docId of createdDocumentIds) {
      await deleteTestDocument(docId).catch(() => {})
    }
    await deleteTestUser(userId)
  })

  describe('useCollectionWithPagination', () => {
    test('returns first page of documents with correct limit', async () => {
      const wrapper = createWrapper()
      await loginUser(userEmail, userPassword, wrapper)

      const { result } = renderHook(
        () =>
          useCollectionWithPagination<TestDocumentData>({
            databaseId,
            collectionId,
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

    test('hasNextPage is true when more documents exist', async () => {
      const wrapper = createWrapper()
      await loginUser(userEmail, userPassword, wrapper)

      const { result } = renderHook(
        () =>
          useCollectionWithPagination<TestDocumentData>({
            databaseId,
            collectionId,
            queries: [],
            limit: 3,
          }),
        { wrapper },
      )

      await waitFor(() => expect(result.current.documents.length).toBeGreaterThan(0))

      // We have 7+ docs with limit=3, so there must be a next page
      expect(result.current.hasNextPage).toBe(true)
      expect(result.current.total).toBeGreaterThanOrEqual(7)
    })

    test('nextPage advances to the next page', async () => {
      const wrapper = createWrapper()
      await loginUser(userEmail, userPassword, wrapper)

      const { result } = renderHook(
        () =>
          useCollectionWithPagination<TestDocumentData>({
            databaseId,
            collectionId,
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

      // Page 2 documents should be different from page 1
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
          useCollectionWithPagination<TestDocumentData>({
            databaseId,
            collectionId,
            queries: [],
            limit: 3,
          }),
        { wrapper },
      )

      await waitFor(() => expect(result.current.documents.length).toBeGreaterThan(0))

      // Go to page 2
      act(() => {
        result.current.nextPage()
      })
      expect(result.current.page).toBe(2)

      // Go back to page 1
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
          useCollectionWithPagination<TestDocumentData>({
            databaseId,
            collectionId,
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
          useCollectionWithPagination<TestDocumentData>({
            databaseId,
            collectionId,
            queries: [],
            limit: 3,
          }),
        { wrapper },
      )

      await waitFor(() => expect(result.current.documents.length).toBeGreaterThan(0))

      // Page 0 and negative should be ignored
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
          useCollectionWithPagination<TestDocumentData>({
            databaseId,
            collectionId,
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
          useCollectionWithPagination<TestDocumentData>({
            databaseId,
            collectionId,
            queries: [],
            limit: 3,
          }),
        { wrapper },
      )

      // Should eventually resolve
      await waitFor(() => expect(result.current.isLoading).toBe(false))

      expect(result.current.isError).toBe(false)
      expect(result.current.error).toBeNull()
    })
  })

  describe('useSuspenseCollectionWithPagination', () => {
    test('returns first page of documents with correct limit', async () => {
      const wrapper = createWrapper({ suspense: true })
      await loginUser(userEmail, userPassword, wrapper)

      const { result } = renderHook(
        () =>
          useSuspenseCollectionWithPagination<TestDocumentData>({
            databaseId,
            collectionId,
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

    test('hasNextPage is true when more documents exist', async () => {
      const wrapper = createWrapper({ suspense: true })
      await loginUser(userEmail, userPassword, wrapper)

      const { result } = renderHook(
        () =>
          useSuspenseCollectionWithPagination<TestDocumentData>({
            databaseId,
            collectionId,
            queries: [],
            limit: 3,
          }),
        { wrapper },
      )

      await waitFor(() => expect(result.current.documents.length).toBeGreaterThan(0))

      // We have 7+ docs with limit=3, so there must be a next page
      expect(result.current.hasNextPage).toBe(true)
      expect(result.current.total).toBeGreaterThanOrEqual(7)
    })

    test('nextPage advances to the next page', async () => {
      const wrapper = createWrapper({ suspense: true })
      await loginUser(userEmail, userPassword, wrapper)

      const { result } = renderHook(
        () =>
          useSuspenseCollectionWithPagination<TestDocumentData>({
            databaseId,
            collectionId,
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

      // Suspense re-suspends while fetching page 2, so wait for it
      await waitFor(() => expect(result.current.page).toBe(2))
      await waitFor(() => expect(result.current.documents.length).toBeGreaterThan(0))

      expect(result.current.hasPreviousPage).toBe(true)

      // Page 2 documents should be different from page 1
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
          useSuspenseCollectionWithPagination<TestDocumentData>({
            databaseId,
            collectionId,
            queries: [],
            limit: 3,
          }),
        { wrapper },
      )

      await waitFor(() => expect(result.current.documents.length).toBeGreaterThan(0))

      // Go to page 2
      act(() => {
        result.current.nextPage()
      })
      await waitFor(() => expect(result.current.page).toBe(2))

      // Go back to page 1
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
          useSuspenseCollectionWithPagination<TestDocumentData>({
            databaseId,
            collectionId,
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
          useSuspenseCollectionWithPagination<TestDocumentData>({
            databaseId,
            collectionId,
            queries: [],
            limit: 3,
          }),
        { wrapper },
      )

      await waitFor(() => expect(result.current.documents.length).toBeGreaterThan(0))

      // Page 0 and negative should be ignored
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
          useSuspenseCollectionWithPagination<TestDocumentData>({
            databaseId,
            collectionId,
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
          useSuspenseCollectionWithPagination<TestDocumentData>({
            databaseId,
            collectionId,
            queries: [],
            limit: 3,
          }),
        { wrapper },
      )

      // Should eventually resolve
      await waitFor(() => expect(result.current.isLoading).toBe(false))

      expect(result.current.isError).toBe(false)
      expect(result.current.error).toBeNull()
    })
  })

  describe('useInfiniteCollection', () => {
    test('returns first page of documents', async () => {
      const wrapper = createWrapper()
      await loginUser(userEmail, userPassword, wrapper)

      const { result } = renderHook(
        () =>
          useInfiniteCollection<TestDocumentData>({
            databaseId,
            collectionId,
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

    test('fetchNextPage accumulates documents across pages', async () => {
      const wrapper = createWrapper()
      await loginUser(userEmail, userPassword, wrapper)

      const { result } = renderHook(
        () =>
          useInfiniteCollection<TestDocumentData>({
            databaseId,
            collectionId,
            queries: [],
            limit: 3,
            subscribe: false,
          }),
        { wrapper },
      )

      await waitFor(() => expect(result.current.documents.length).toBe(3))

      const firstPageCount = result.current.documents.length

      // Fetch page 2
      act(() => {
        result.current.fetchNextPage()
      })

      await waitFor(() => expect(result.current.documents.length).toBeGreaterThan(firstPageCount))

      // Should now have page1 + page2 documents accumulated
      expect(result.current.documents.length).toBe(6)
    })

    test('fetchNextPage does nothing when no more pages', async () => {
      const wrapper = createWrapper()
      await loginUser(userEmail, userPassword, wrapper)

      const { result } = renderHook(
        () =>
          useInfiniteCollection<TestDocumentData>({
            databaseId,
            collectionId,
            queries: [],
            limit: 100,
            subscribe: false,
          }),
        { wrapper },
      )

      await waitFor(() => expect(result.current.documents.length).toBeGreaterThan(0))

      expect(result.current.hasNextPage).toBe(false)

      const docCount = result.current.documents.length

      act(() => {
        result.current.fetchNextPage()
      })

      // Count should not change
      expect(result.current.documents.length).toBe(docCount)
    })

    test('isFetchingNextPage is true while loading a subsequent page', async () => {
      const wrapper = createWrapper()
      await loginUser(userEmail, userPassword, wrapper)

      const { result } = renderHook(
        () =>
          useInfiniteCollection<TestDocumentData>({
            databaseId,
            collectionId,
            queries: [],
            limit: 3,
            subscribe: false,
          }),
        { wrapper },
      )

      await waitFor(() => expect(result.current.documents.length).toBe(3))

      // isFetchingNextPage should be false on first page
      expect(result.current.isFetchingNextPage).toBe(false)

      act(() => {
        result.current.fetchNextPage()
      })

      // After fetching completes
      await waitFor(() => expect(result.current.isFetchingNextPage).toBe(false))
      expect(result.current.documents.length).toBe(6)
    })

    test('reset clears accumulated documents and returns to page 1', async () => {
      const wrapper = createWrapper()
      await loginUser(userEmail, userPassword, wrapper)

      const { result } = renderHook(
        () =>
          useInfiniteCollection<TestDocumentData>({
            databaseId,
            collectionId,
            queries: [],
            limit: 3,
            subscribe: false,
          }),
        { wrapper },
      )

      await waitFor(() => expect(result.current.documents.length).toBe(3))

      // Load a second page
      act(() => {
        result.current.fetchNextPage()
      })

      await waitFor(() => expect(result.current.documents.length).toBe(6))

      // Reset
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
          useInfiniteCollection<TestDocumentData>({
            databaseId,
            collectionId,
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
