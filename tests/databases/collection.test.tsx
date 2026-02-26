import { act, renderHook, waitFor } from '@testing-library/react'
import { afterAll, beforeAll, describe, expect, test } from 'bun:test'

import { useCollection, useLogin, useSuspenseCollection } from '../../src'
import {
  createTestDocument,
  createTestUser,
  deleteTestDocument,
  deleteTestUser,
  getTestConfig,
} from '../setup/helpers'
import { createWrapper } from '../setup/wrapper'

interface TestDocumentData {
  name: string
  age?: number
  active?: boolean
}

async function loginUser(
  email: string,
  password: string,
  wrapper: ReturnType<typeof createWrapper>,
): Promise<void> {
  const { result } = renderHook(() => useLogin(), { wrapper })

  await act(async () => {
    result.current.login.mutateAsync({ email, password })
  })

  await waitFor(() => expect(result.current.login.isSuccess).toBe(true))
}

describe('Collection query hooks', () => {
  const config = getTestConfig()
  const { databaseId, collectionId } = config
  let userId: string
  let userEmail: string
  let userPassword: string
  const createdDocumentIds: string[] = []

  const testDocuments = [
    { name: 'Alice', age: 25, active: true },
    { name: 'Bob', age: 30, active: false },
    { name: 'Charlie', age: 35, active: true },
  ]

  beforeAll(async () => {
    const user = await createTestUser({ name: 'Collection Query User' })
    userId = user.userId
    userEmail = user.email
    userPassword = user.password

    // Create test documents via server SDK
    for (const docData of testDocuments) {
      const doc = await createTestDocument(docData)
      createdDocumentIds.push(doc.$id)
    }
  })

  afterAll(async () => {
    for (const docId of createdDocumentIds) {
      await deleteTestDocument(docId)
    }
    await deleteTestUser(userId)
  })

  describe('useCollection', () => {
    test('lists all documents in the collection', async () => {
      const wrapper = createWrapper()
      await loginUser(userEmail, userPassword, wrapper)

      const { result } = renderHook(
        () =>
          useCollection<TestDocumentData>({
            databaseId,
            collectionId,
            queries: [],
          }),
        { wrapper },
      )

      await waitFor(() => expect(result.current.isSuccess).toBe(true))

      expect(result.current.documents).toBeDefined()
      expect(result.current.total).toBeDefined()
      expect(result.current.total).toBeGreaterThanOrEqual(testDocuments.length)
    })

    test('returns documents with parsed data fields', async () => {
      const wrapper = createWrapper()
      await loginUser(userEmail, userPassword, wrapper)

      const { result } = renderHook(
        () =>
          useCollection<TestDocumentData>({
            databaseId,
            collectionId,
            queries: [],
          }),
        { wrapper },
      )

      await waitFor(() => expect(result.current.isSuccess).toBe(true))

      const documents = result.current.documents ?? []
      expect(documents.length).toBeGreaterThanOrEqual(testDocuments.length)

      // Verify that the returned documents have parsed fields (not raw JSON strings)
      const knownNames = testDocuments.map((d) => d.name)
      const matchedDocuments = documents.filter((doc) => knownNames.includes(doc.name))
      expect(matchedDocuments.length).toBe(testDocuments.length)

      for (const doc of matchedDocuments) {
        expect((doc as any)._id).toBeDefined()
        expect(typeof doc.name).toBe('string')
      }
    })

    test('each document contains _id and spread data fields', async () => {
      const wrapper = createWrapper()
      await loginUser(userEmail, userPassword, wrapper)

      const { result } = renderHook(
        () =>
          useCollection<TestDocumentData>({
            databaseId,
            collectionId,
            queries: [],
          }),
        { wrapper },
      )

      await waitFor(() => expect(result.current.isSuccess).toBe(true))

      const documents = result.current.documents ?? []
      const alice = documents.find((doc) => doc.name === 'Alice')

      expect(alice).toBeDefined()
      expect((alice as any)?._id).toBeDefined()
      expect(alice?.name).toBe('Alice')
      expect(alice?.age).toBe(25)
      expect(alice?.active).toBe(true)
    })

    test('returns total count of documents', async () => {
      const wrapper = createWrapper()
      await loginUser(userEmail, userPassword, wrapper)

      const { result } = renderHook(
        () =>
          useCollection<TestDocumentData>({
            databaseId,
            collectionId,
            queries: [],
          }),
        { wrapper },
      )

      await waitFor(() => expect(result.current.isSuccess).toBe(true))

      expect(typeof result.current.total).toBe('number')
      expect(result.current.total).toBeGreaterThanOrEqual(3)
    })

    test('provides standard query result properties', async () => {
      const wrapper = createWrapper()
      await loginUser(userEmail, userPassword, wrapper)

      const { result } = renderHook(
        () =>
          useCollection<TestDocumentData>({
            databaseId,
            collectionId,
            queries: [],
          }),
        { wrapper },
      )

      await waitFor(() => expect(result.current.isSuccess).toBe(true))

      // Standard react-query properties should be present
      expect(result.current.isLoading).toBe(false)
      expect(result.current.isError).toBe(false)
      expect(result.current.data).toBeDefined()
    })

    test('can disable realtime subscription', async () => {
      const wrapper = createWrapper()
      await loginUser(userEmail, userPassword, wrapper)

      const { result } = renderHook(
        () =>
          useCollection<TestDocumentData>({
            databaseId,
            collectionId,
            queries: [],
            subscribe: false,
          }),
        { wrapper },
      )

      await waitFor(() => expect(result.current.isSuccess).toBe(true))

      expect(result.current.documents).toBeDefined()
      expect(result.current.total).toBeGreaterThanOrEqual(testDocuments.length)
    })
  })

  describe('useSuspenseCollection', () => {
    test('loads documents with suspense boundary', async () => {
      const wrapper = createWrapper({ suspense: true })
      await loginUser(userEmail, userPassword, wrapper)

      const { result } = renderHook(
        () =>
          useSuspenseCollection<TestDocumentData>({
            databaseId,
            collectionId,
            queries: [],
          }),
        { wrapper },
      )

      await waitFor(() => expect(result.current.data).toBeDefined())

      expect(result.current.documents).toBeDefined()
      expect(result.current.total).toBeGreaterThanOrEqual(testDocuments.length)

      const documents = result.current.documents ?? []
      expect(documents.length).toBeGreaterThanOrEqual(testDocuments.length)
    })

    test('returns parsed document data through suspense', async () => {
      const wrapper = createWrapper({ suspense: true })
      await loginUser(userEmail, userPassword, wrapper)

      const { result } = renderHook(
        () =>
          useSuspenseCollection<TestDocumentData>({
            databaseId,
            collectionId,
            queries: [],
          }),
        { wrapper },
      )

      await waitFor(() => expect(result.current.data).toBeDefined())

      const documents = result.current.documents ?? []
      const bob = documents.find((doc) => doc.name === 'Bob')

      expect(bob).toBeDefined()
      expect(bob?.name).toBe('Bob')
      expect(bob?.age).toBe(30)
      expect(bob?.active).toBe(false)
    })

    test('exposes total count alongside documents', async () => {
      const wrapper = createWrapper({ suspense: true })
      await loginUser(userEmail, userPassword, wrapper)

      const { result } = renderHook(
        () =>
          useSuspenseCollection<TestDocumentData>({
            databaseId,
            collectionId,
            queries: [],
          }),
        { wrapper },
      )

      await waitFor(() => expect(result.current.data).toBeDefined())

      expect(typeof result.current.total).toBe('number')
      expect(result.current.total).toBeGreaterThanOrEqual(3)
    })
  })
})
