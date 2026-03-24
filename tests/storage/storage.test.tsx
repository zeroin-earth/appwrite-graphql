import { act } from 'react'
import { renderHook, waitFor } from '@testing-library/react'
import { afterAll, beforeAll, describe, expect, test } from 'bun:test'
import { Permission, Role } from 'node-appwrite'

import {
  useCreateFile,
  useDeleteFile,
  useFile,
  useFileDownload,
  useFilePreview,
  useFiles,
  useFileView,
  useUpdateFile,
} from '../../src'
import { createTestUser, deleteTestUser, loginUser } from '../setup/helpers'
import { createWrapper } from '../setup/wrapper'

describe('Storage content URL hooks', () => {
  let userEmail: string
  let userPassword: string
  let userId: string

  beforeAll(async () => {
    const user = await createTestUser({ name: 'Storage Test User' })
    userId = user.userId
    userEmail = user.email
    userPassword = user.password
  })

  afterAll(async () => {
    await deleteTestUser(userId)
  })

  describe('full file lifecycle', () => {
    test('useCreateFile', async () => {
      const wrapper = createWrapper()
      await loginUser(userEmail, userPassword, wrapper)
      const { result: createResult } = renderHook(() => useCreateFile(), {
        wrapper,
      })

      expect(createResult.current).toBeDefined()

      await act(async () => {
        const file = new File(['This is a test file.'], 'test-file.txt', {
          type: 'text/plain',
        })
        await createResult.current.mutateAsync({
          bucketId: 'test-bucket',
          fileId: 'test-file',
          file,
          permissions: [
            Permission.read(Role.any()),
            Permission.update(Role.users()),
            Permission.delete(Role.users()),
            Permission.write(Role.users()),
          ],
        })
      })

      await waitFor(() => {
        expect(createResult.current.isSuccess).toBe(true)
        expect(createResult.current.data).toBeDefined()
        expect(createResult.current.data.bucketId).toBe('test-bucket')
        expect(createResult.current.data.name).toBe('test-file.txt')
      })
    })

    test('useFile', async () => {
      const wrapper = createWrapper()
      await loginUser(userEmail, userPassword, wrapper)
      const { result: fileResult } = renderHook(
        () => useFile({ bucketId: 'test-bucket', fileId: 'test-file' }),
        { wrapper },
      )

      await waitFor(() => {
        expect(fileResult.current.isSuccess).toBe(true)
        expect(fileResult.current.data).toBeDefined()
        expect(fileResult.current.data.bucketId).toBe('test-bucket')
        expect(fileResult.current.data.name).toBe('test-file.txt')
      })
    })

    test('useUpdateFile', async () => {
      const wrapper = createWrapper()
      await loginUser(userEmail, userPassword, wrapper)
      const { result: updateResult } = renderHook(() => useUpdateFile(), {
        wrapper,
      })

      expect(updateResult.current).toBeDefined()

      await act(async () => {
        await updateResult.current.mutateAsync({
          bucketId: 'test-bucket',
          fileId: 'test-file',
          name: 'updated-file.txt',
          permissions: [
            Permission.read(Role.any()),
            Permission.update(Role.users()),
            Permission.delete(Role.users()),
            Permission.write(Role.users()),
          ],
        })
      })

      await waitFor(() => {
        expect(updateResult.current.isSuccess).toBe(true)
        expect(updateResult.current.data).toBeDefined()
        expect(updateResult.current.data.bucketId).toBe('test-bucket')
        expect(updateResult.current.data.name).toBe('updated-file.txt')
      })
    })

    test('useFiles', async () => {
      const wrapper = createWrapper()
      await loginUser(userEmail, userPassword, wrapper)
      const { result: filesResult } = renderHook(
        () => useFiles({ bucketId: 'test-bucket', search: 'updated-file' }),
        { wrapper },
      )

      await waitFor(() => {
        expect(filesResult.current.isSuccess).toBe(true)
        expect(filesResult.current.data).toBeDefined()
        expect(filesResult.current.data.total).toBe(1)
        expect(filesResult.current.data.files[0].name).toBe('updated-file.txt')
      })
    })

    test('useDeleteFile', async () => {
      const wrapper = createWrapper()
      await loginUser(userEmail, userPassword, wrapper)
      const { result: deleteResult } = renderHook(() => useDeleteFile(), {
        wrapper,
      })

      expect(deleteResult.current).toBeDefined()

      await act(async () => {
        await deleteResult.current.mutateAsync({
          bucketId: 'test-bucket',
          fileId: 'test-file',
        })
      })

      await waitFor(() => {
        expect(deleteResult.current.isSuccess).toBe(true)
      })
    })
  })

  describe('useFileDownload', () => {
    test('returns a download URL for a file', () => {
      const wrapper = createWrapper()
      const { result } = renderHook(
        () => useFileDownload({ bucketId: 'test-bucket', fileId: 'test-file' }),
        { wrapper },
      )

      expect(result.current).toBeDefined()
      expect(typeof result.current).toBe('string')
      expect(result.current).toContain('/storage/buckets/test-bucket/files/test-file/download')
    })
  })

  describe('useFilePreview', () => {
    test('returns a preview URL for a file', () => {
      const wrapper = createWrapper()
      const { result } = renderHook(
        () => useFilePreview({ bucketId: 'test-bucket', fileId: 'test-file' }),
        { wrapper },
      )

      expect(result.current).toBeDefined()
      expect(typeof result.current).toBe('string')
      expect(result.current).toContain('/storage/buckets/test-bucket/files/test-file/preview')
    })

    test('includes image transformation parameters', () => {
      const wrapper = createWrapper()
      const { result } = renderHook(
        () =>
          useFilePreview({
            bucketId: 'test-bucket',
            fileId: 'test-file',
            width: 200,
            height: 150,
            quality: 80,
          }),
        { wrapper },
      )

      expect(result.current).toContain('width=200')
      expect(result.current).toContain('height=150')
      expect(result.current).toContain('quality=80')
    })
  })

  describe('useFileView', () => {
    test('returns a view URL for a file', () => {
      const wrapper = createWrapper()
      const { result } = renderHook(
        () => useFileView({ bucketId: 'test-bucket', fileId: 'test-file' }),
        { wrapper },
      )

      expect(result.current).toBeDefined()
      expect(typeof result.current).toBe('string')
      expect(result.current).toContain('/storage/buckets/test-bucket/files/test-file/view')
    })
  })
})
