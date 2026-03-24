import { useMemo } from 'react'

import { useAppwrite } from '../useAppwrite'

/**
 * Returns a URL for downloading a file from a storage bucket.
 * Memoized to avoid unnecessary recomputation.
 * @param params - The bucket ID, file ID, and optional access token.
 */
export function useFileDownload({
  bucketId,
  fileId,
  token,
}: {
  bucketId: string
  fileId: string
  token?: string
}) {
  const { storage } = useAppwrite()

  const url = useMemo(
    () => storage?.getFileDownload({ bucketId, fileId, token }),
    [storage, bucketId, fileId, token],
  )

  return url
}
