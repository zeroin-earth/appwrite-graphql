import { renderHook } from '@testing-library/react'
import { describe, expect, test } from 'bun:test'

import { useFileDownload, useFilePreview, useFileView } from '../../src'
import { createWrapper } from '../setup/wrapper'

/*
 * Storage content hooks (useFileDownload, useFilePreview, useFileView)
 * return URL strings via the REST SDK — they don't make API calls.
 * We verify they produce well-formed URLs.
 *
 * The GraphQL-based storage hooks (useFile, useFiles, useCreateFile, etc.)
 * require a storage bucket to be set up. Since the test setup doesn't create one,
 * we test the URL-generating hooks which work without server state.
 */

describe('Storage content URL hooks', () => {
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
