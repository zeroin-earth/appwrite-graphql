import { act, renderHook, waitFor } from '@testing-library/react'
import { afterAll, beforeAll, describe, expect, test } from 'bun:test'

import {
  useDecrementAttribute,
  useDeleteDocument,
  useDocument,
  useIncrementAttribute,
  useQueryClient,
  useUpdateDocument,
  useUpsertDocument,
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
  active?: boolean
  score?: number
}

describe('Optimistic update hooks', () => {
  const config = getTestConfig()
  const { databaseId, collectionId } = config
  let userId: string
  let userEmail: string
  let userPassword: string
  const createdDocumentIds: string[] = []

  beforeAll(async () => {
    const user = await createTestUser({ name: 'Optimistic User' })
    userId = user.userId
    userEmail = user.email
    userPassword = user.password
  })

  afterAll(async () => {
    for (const docId of createdDocumentIds) {
      await deleteTestDocument(docId).catch(() => {})
    }
    await deleteTestUser(userId)
  })

  describe('useUpdateDocument optimistic', () => {
    test('optimistically updates the document cache before server responds', async () => {
      const doc = await createTestDocument({ name: 'Optimistic Update', age: 25 })
      createdDocumentIds.push(doc.$id)

      const wrapper = createWrapper()
      await loginUser(userEmail, userPassword, wrapper)

      // First, populate the document cache
      const { result: readResult } = renderHook(
        () =>
          useDocument<TestDocumentData>({
            databaseId,
            collectionId,
            documentId: doc.$id,
          }),
        { wrapper },
      )

      await waitFor(() => expect(readResult.current.isSuccess).toBe(true))
      expect(readResult.current.data?.name).toBe('Optimistic Update')

      const { result: queryClient } = renderHook(() => useQueryClient(), { wrapper })

      // Perform the mutation
      const { result: mutation } = renderHook(() => useUpdateDocument(), { wrapper })

      await act(async () => {
        mutation.current.mutate({
          databaseId,
          collectionId,
          documentId: doc.$id,
          data: { name: 'Instantly Updated' },
        })
      })

      // The cache should be optimistically updated immediately (before server response)
      const entries = queryClient.current.getQueriesData({
        queryKey: [
          'appwrite',
          'databases',
          databaseId,
          collectionId,
          'documents',
          doc.$id,
        ],
      })

      expect(entries.length).toBeGreaterThan(0)
      const cachedDoc = entries[0][1] as TestDocumentData | undefined

      expect(cachedDoc?.name).toBe('Instantly Updated')
      // Other fields should be preserved
      expect(cachedDoc?.age).toBe(25)

      await waitFor(() => expect(mutation.current.isSuccess).toBe(true))
    })

    test('preserves unmodified fields during optimistic update', async () => {
      const doc = await createTestDocument({ name: 'Partial Update', age: 40, active: true })
      createdDocumentIds.push(doc.$id)

      const wrapper = createWrapper()
      await loginUser(userEmail, userPassword, wrapper)

      const { result: readResult } = renderHook(
        () =>
          useDocument<TestDocumentData>({
            databaseId,
            collectionId,
            documentId: doc.$id,
          }),
        { wrapper },
      )

      await waitFor(() => expect(readResult.current.isSuccess).toBe(true))

      const { result: queryClient } = renderHook(() => useQueryClient(), { wrapper })
      const { result: mutation } = renderHook(() => useUpdateDocument(), { wrapper })

      // Only update name, leave age and active untouched
      await act(async () => {
        mutation.current.mutate({
          databaseId,
          collectionId,
          documentId: doc.$id,
          data: { name: 'Only Name Changed' },
        })
      })

      const entries = queryClient.current.getQueriesData({
        queryKey: [
          'appwrite',
          'databases',
          databaseId,
          collectionId,
          'documents',
          doc.$id,
        ],
      })

      expect(entries.length).toBeGreaterThan(0)
      const cachedDoc = entries[0][1] as TestDocumentData | undefined

      expect(cachedDoc?.name).toBe('Only Name Changed')
      expect(cachedDoc?.age).toBe(40)
      expect(cachedDoc?.active).toBe(true)

      await waitFor(() => expect(mutation.current.isSuccess).toBe(true))
    })
  })

  describe('useDeleteDocument optimistic', () => {
    test('optimistically removes document from cache', async () => {
      const doc = await createTestDocument({ name: 'Optimistic Delete' })
      createdDocumentIds.push(doc.$id)

      const wrapper = createWrapper()
      await loginUser(userEmail, userPassword, wrapper)

      // Populate cache
      const { result: readResult } = renderHook(
        () =>
          useDocument<TestDocumentData>({
            databaseId,
            collectionId,
            documentId: doc.$id,
          }),
        { wrapper },
      )

      await waitFor(() => expect(readResult.current.isSuccess).toBe(true))

      const { result: queryClient } = renderHook(() => useQueryClient(), { wrapper })

      const documentKeyPrefix = ['appwrite', 'databases', databaseId, collectionId, 'documents', doc.$id]

      // Verify cache is populated
      const beforeEntries = queryClient.current.getQueriesData({ queryKey: documentKeyPrefix })
      expect(beforeEntries.length).toBeGreaterThan(0)

      const { result: mutation } = renderHook(() => useDeleteDocument(), { wrapper })

      await act(async () => {
        mutation.current.mutate({
          databaseId,
          collectionId,
          documentId: doc.$id,
        })
      })

      // Cache should be immediately cleared
      const afterEntries = queryClient.current.getQueriesData({ queryKey: documentKeyPrefix })
      const hasData = afterEntries.some(([, data]) => data !== undefined)
      expect(hasData).toBe(false)

      await waitFor(() => expect(mutation.current.isSuccess).toBe(true))

      // Remove from cleanup list since already deleted
      const idx = createdDocumentIds.indexOf(doc.$id)
      if (idx !== -1) createdDocumentIds.splice(idx, 1)
    })
  })

  describe('useUpsertDocument optimistic', () => {
    test('optimistically updates existing document cache', async () => {
      const doc = await createTestDocument({ name: 'Optimistic Upsert', age: 50 })
      createdDocumentIds.push(doc.$id)

      const wrapper = createWrapper()
      await loginUser(userEmail, userPassword, wrapper)

      // Populate cache
      const { result: readResult } = renderHook(
        () =>
          useDocument<TestDocumentData>({
            databaseId,
            collectionId,
            documentId: doc.$id,
          }),
        { wrapper },
      )

      await waitFor(() => expect(readResult.current.isSuccess).toBe(true))

      const { result: queryClient } = renderHook(() => useQueryClient(), { wrapper })

      const { result: mutation } = renderHook(() => useUpsertDocument(), { wrapper })

      await act(async () => {
        mutation.current.mutate({
          databaseId,
          collectionId,
          documentId: doc.$id,
          data: { name: 'Upserted Instantly', age: 51 },
        })
      })

      const entries = queryClient.current.getQueriesData({
        queryKey: [
          'appwrite',
          'databases',
          databaseId,
          collectionId,
          'documents',
          doc.$id,
        ],
      })

      expect(entries.length).toBeGreaterThan(0)
      const cachedDoc = entries[0][1] as TestDocumentData | undefined

      expect(cachedDoc?.name).toBe('Upserted Instantly')
      expect(cachedDoc?.age).toBe(51)

      await waitFor(() => expect(mutation.current.isSuccess).toBe(true))
    })
  })

  describe('useIncrementAttribute optimistic', () => {
    test('optimistically increments the attribute in cache', async () => {
      const doc = await createTestDocument({ name: 'Inc Test', age: 10 })
      createdDocumentIds.push(doc.$id)

      const wrapper = createWrapper()
      await loginUser(userEmail, userPassword, wrapper)

      // Populate cache
      const { result: readResult } = renderHook(
        () =>
          useDocument<TestDocumentData>({
            databaseId,
            collectionId,
            documentId: doc.$id,
          }),
        { wrapper },
      )

      await waitFor(() => expect(readResult.current.isSuccess).toBe(true))
      expect(readResult.current.data?.age).toBe(10)

      const { result: queryClient } = renderHook(() => useQueryClient(), { wrapper })

      const { result: mutation } = renderHook(() => useIncrementAttribute(), { wrapper })

      await act(async () => {
        mutation.current.mutate({
          databaseId,
          collectionId,
          documentId: doc.$id,
          attribute: 'age',
          value: 5,
        })
      })

      const incEntries = queryClient.current.getQueriesData({
        queryKey: [
          'appwrite',
          'databases',
          databaseId,
          collectionId,
          'documents',
          doc.$id,
        ],
      })

      expect(incEntries.length).toBeGreaterThan(0)
      const incCachedDoc = incEntries[0][1] as TestDocumentData | undefined

      expect(incCachedDoc?.age).toBe(15)

      await waitFor(() => expect(mutation.current.isSuccess).toBe(true))
    })

    test('respects max bound in optimistic update', async () => {
      const doc = await createTestDocument({ name: 'Max Test', age: 95 })
      createdDocumentIds.push(doc.$id)

      const wrapper = createWrapper()
      await loginUser(userEmail, userPassword, wrapper)

      const { result: readResult } = renderHook(
        () =>
          useDocument<TestDocumentData>({
            databaseId,
            collectionId,
            documentId: doc.$id,
          }),
        { wrapper },
      )

      await waitFor(() => expect(readResult.current.isSuccess).toBe(true))

      const { result: queryClient } = renderHook(() => useQueryClient(), { wrapper })
      const { result: mutation } = renderHook(() => useIncrementAttribute(), { wrapper })

      await act(async () => {
        mutation.current.mutate({
          databaseId,
          collectionId,
          documentId: doc.$id,
          attribute: 'age',
          value: 10,
          max: 100,
        })
      })

      const maxEntries = queryClient.current.getQueriesData({
        queryKey: [
          'appwrite',
          'databases',
          databaseId,
          collectionId,
          'documents',
          doc.$id,
        ],
      })

      expect(maxEntries.length).toBeGreaterThan(0)
      const maxCachedDoc = maxEntries[0][1] as TestDocumentData | undefined

      // 95 + 10 = 105, but max is 100
      expect(maxCachedDoc?.age).toBe(100)

      await waitFor(() => expect(mutation.current.isSuccess || mutation.current.isError).toBe(true))
    })
  })

  describe('useDecrementAttribute optimistic', () => {
    test('optimistically decrements the attribute in cache', async () => {
      const doc = await createTestDocument({ name: 'Dec Test', age: 20 })
      createdDocumentIds.push(doc.$id)

      const wrapper = createWrapper()
      await loginUser(userEmail, userPassword, wrapper)

      const { result: readResult } = renderHook(
        () =>
          useDocument<TestDocumentData>({
            databaseId,
            collectionId,
            documentId: doc.$id,
          }),
        { wrapper },
      )

      await waitFor(() => expect(readResult.current.isSuccess).toBe(true))
      expect(readResult.current.data?.age).toBe(20)

      const { result: queryClient } = renderHook(() => useQueryClient(), { wrapper })
      const { result: mutation } = renderHook(() => useDecrementAttribute(), { wrapper })

      await act(async () => {
        mutation.current.mutate({
          databaseId,
          collectionId,
          documentId: doc.$id,
          attribute: 'age',
          value: 7,
        })
      })

      const decEntries = queryClient.current.getQueriesData({
        queryKey: [
          'appwrite',
          'databases',
          databaseId,
          collectionId,
          'documents',
          doc.$id,
        ],
      })

      expect(decEntries.length).toBeGreaterThan(0)
      const decCachedDoc = decEntries[0][1] as TestDocumentData | undefined

      expect(decCachedDoc?.age).toBe(13)

      await waitFor(() => expect(mutation.current.isSuccess).toBe(true))
    })

    test('respects min bound in optimistic update', async () => {
      const doc = await createTestDocument({ name: 'Min Test', age: 3 })
      createdDocumentIds.push(doc.$id)

      const wrapper = createWrapper()
      await loginUser(userEmail, userPassword, wrapper)

      const { result: readResult } = renderHook(
        () =>
          useDocument<TestDocumentData>({
            databaseId,
            collectionId,
            documentId: doc.$id,
          }),
        { wrapper },
      )

      await waitFor(() => expect(readResult.current.isSuccess).toBe(true))

      const { result: queryClient } = renderHook(() => useQueryClient(), { wrapper })
      const { result: mutation } = renderHook(() => useDecrementAttribute(), { wrapper })

      await act(async () => {
        mutation.current.mutate({
          databaseId,
          collectionId,
          documentId: doc.$id,
          attribute: 'age',
          value: 10,
          min: 0,
        })
      })

      const minEntries = queryClient.current.getQueriesData({
        queryKey: [
          'appwrite',
          'databases',
          databaseId,
          collectionId,
          'documents',
          doc.$id,
        ],
      })

      expect(minEntries.length).toBeGreaterThan(0)
      const minCachedDoc = minEntries[0][1] as TestDocumentData | undefined

      // 3 - 10 = -7, but min is 0
      expect(minCachedDoc?.age).toBe(0)

      await waitFor(() => expect(mutation.current.isSuccess || mutation.current.isError).toBe(true))
    })
  })
})
