import { act, renderHook, waitFor } from '@testing-library/react'
import { afterAll, beforeAll, describe, expect, test } from 'bun:test'

import {
  useCreateDocument,
  useDeleteDocument,
  useDocument,
  useUpdateDocument,
  useUpsertDocument,
} from '../../src'
import { ID } from '../../src/types'
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
}

describe('Document CRUD hooks', () => {
  const config = getTestConfig()
  const { databaseId, collectionId } = config
  let userId: string
  let userEmail: string
  let userPassword: string
  const createdDocumentIds: string[] = []

  beforeAll(async () => {
    const user = await createTestUser({ name: 'Doc CRUD User' })
    userId = user.userId
    userEmail = user.email
    userPassword = user.password
  })

  afterAll(async () => {
    for (const docId of createdDocumentIds) {
      await deleteTestDocument(docId)
    }
    await deleteTestUser(userId)
  })

  describe('useCreateDocument', () => {
    test('creates a document and returns the document data', async () => {
      const wrapper = createWrapper()
      await loginUser(userEmail, userPassword, wrapper)

      const { result } = renderHook(() => useCreateDocument(), { wrapper })

      const documentId = ID.unique()

      await act(async () => {
        await result.current.mutateAsync({
          databaseId,
          collectionId,
          documentId,
          data: { name: 'Create Test', age: 25 },
        })
      })

      await waitFor(() => expect(result.current.isSuccess).toBe(true))

      createdDocumentIds.push(documentId)

      expect(result.current.data).toBeDefined()
      expect(result.current.data?._id).toBeDefined()
    })

    test('creates a document with all optional fields', async () => {
      const wrapper = createWrapper()
      await loginUser(userEmail, userPassword, wrapper)

      const { result } = renderHook(() => useCreateDocument(), { wrapper })

      const documentId = ID.unique()

      await act(async () => {
        await result.current.mutateAsync({
          databaseId,
          collectionId,
          documentId,
          data: { name: 'Full Doc', age: 30, active: true },
        })
      })

      await waitFor(() => expect(result.current.isSuccess).toBe(true))

      createdDocumentIds.push(documentId)

      expect(result.current.data).toBeDefined()
    })

    test('fails when required "name" field is missing', async () => {
      const wrapper = createWrapper()
      await loginUser(userEmail, userPassword, wrapper)

      const { result } = renderHook(() => useCreateDocument(), { wrapper })

      await act(async () => {
        result.current.mutate({
          databaseId,
          collectionId,
          documentId: ID.unique(),
          data: { age: 10 },
        })
      })

      await waitFor(() => expect(result.current.isError).toBe(true))
    })
  })

  describe('useDocument', () => {
    let documentId: string

    beforeAll(async () => {
      const doc = await createTestDocument({ name: 'Read Test', age: 42 })
      documentId = doc.$id
      createdDocumentIds.push(documentId)
    })

    test('reads a single document by ID', async () => {
      const wrapper = createWrapper()
      await loginUser(userEmail, userPassword, wrapper)

      const { result } = renderHook(
        () =>
          useDocument<TestDocumentData>({
            databaseId,
            collectionId,
            documentId,
          }),
        { wrapper },
      )

      await waitFor(() => expect(result.current.isSuccess).toBe(true))

      expect(result.current.data).toBeDefined()
      expect((result.current.data as any)?._id).toBe(documentId)
      expect(result.current.data?.name).toBe('Read Test')
      expect(result.current.data?.age).toBe(42)
    })

    test('returns parsed document fields from JSON data', async () => {
      const wrapper = createWrapper()
      await loginUser(userEmail, userPassword, wrapper)

      const { result } = renderHook(
        () =>
          useDocument<TestDocumentData>({
            databaseId,
            collectionId,
            documentId,
          }),
        { wrapper },
      )

      await waitFor(() => expect(result.current.isSuccess).toBe(true))

      // The hook parses the JSON `data` field and spreads it onto the document
      expect(result.current.data?.name).toEqual('Read Test')
      expect(result.current.data?.age).toEqual(42)
    })
  })

  describe('useUpdateDocument', () => {
    let documentId: string

    beforeAll(async () => {
      const doc = await createTestDocument({ name: 'Update Test', age: 20 })
      documentId = doc.$id
      createdDocumentIds.push(documentId)
    })

    test('updates a document and returns updated data', async () => {
      const wrapper = createWrapper()
      await loginUser(userEmail, userPassword, wrapper)

      const { result } = renderHook(() => useUpdateDocument(), { wrapper })

      await act(async () => {
        await result.current.mutateAsync({
          databaseId,
          collectionId,
          documentId,
          data: { name: 'Updated Name' },
        })
      })

      await waitFor(() => expect(result.current.isSuccess).toBe(true))

      expect(result.current.data).toBeDefined()
    })

    test('updates only specified fields without affecting others', async () => {
      const wrapper = createWrapper()
      await loginUser(userEmail, userPassword, wrapper)

      const { result: updateResult } = renderHook(() => useUpdateDocument(), {
        wrapper,
      })

      await act(async () => {
        await updateResult.current.mutateAsync({
          databaseId,
          collectionId,
          documentId,
          data: { name: 'Partial Update' },
        })
      })

      await waitFor(() => expect(updateResult.current.isSuccess).toBe(true))

      // Verify the original age field is still present by reading the document
      const { result: readResult } = renderHook(
        () =>
          useDocument<TestDocumentData>({
            databaseId,
            collectionId,
            documentId,
          }),
        { wrapper },
      )

      await waitFor(() => expect(readResult.current.isSuccess).toBe(true))

      expect(readResult.current.data?.name).toBe('Partial Update')
      expect(readResult.current.data?.age).toBe(20)
    })
  })

  describe('useUpsertDocument', () => {
    test('creates a new document via upsert when it does not exist', async () => {
      const wrapper = createWrapper()
      await loginUser(userEmail, userPassword, wrapper)

      const { result } = renderHook(() => useUpsertDocument(), { wrapper })

      const documentId = ID.unique()

      await act(async () => {
        await result.current.mutateAsync({
          databaseId,
          collectionId,
          documentId,
          data: { name: 'Upsert New', age: 35 },
        })
      })

      await waitFor(() => expect(result.current.isSuccess).toBe(true))

      createdDocumentIds.push(documentId)

      expect(result.current.data).toBeDefined()
      expect(result.current.data?._id).toBeDefined()
    })

    test('updates an existing document via upsert', async () => {
      const wrapper = createWrapper()
      await loginUser(userEmail, userPassword, wrapper)

      // First create a document via server SDK
      const doc = await createTestDocument({ name: 'Upsert Existing', age: 40 })
      const existingDocId = doc.$id
      createdDocumentIds.push(existingDocId)

      const { result } = renderHook(() => useUpsertDocument(), { wrapper })

      await act(async () => {
        await result.current.mutateAsync({
          databaseId,
          collectionId,
          documentId: existingDocId,
          data: { name: 'Upsert Updated', age: 41 },
        })
      })

      await waitFor(() => expect(result.current.isSuccess).toBe(true))

      expect(result.current.data).toBeDefined()
      expect(result.current.data?._id).toBe(existingDocId)
    })
  })

  describe('useDeleteDocument', () => {
    test('deletes a document and returns status', async () => {
      const wrapper = createWrapper()
      await loginUser(userEmail, userPassword, wrapper)

      // Create a document to delete
      const doc = await createTestDocument({ name: 'Delete Test' })

      const { result } = renderHook(() => useDeleteDocument(), { wrapper })

      await act(async () => {
        await result.current.mutateAsync({
          databaseId,
          collectionId,
          documentId: doc.$id,
        })
      })

      await waitFor(() => expect(result.current.isSuccess).toBe(true))

      expect(result.current.data).toBeDefined()
      expect(result.current.data?.status).toBeDefined()
    })

    test('fails when deleting a non-existent document', async () => {
      const wrapper = createWrapper()
      await loginUser(userEmail, userPassword, wrapper)

      const { result } = renderHook(() => useDeleteDocument(), { wrapper })

      await act(async () => {
        result.current.mutate({
          databaseId,
          collectionId,
          documentId: 'non-existent-id',
        })
      })

      await waitFor(() => expect(result.current.isError).toBe(true))
    })
  })
})
