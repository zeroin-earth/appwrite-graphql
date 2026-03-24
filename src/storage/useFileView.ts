import { useMemo } from 'react'

import { useAppwrite } from '../useAppwrite'

/**
 * Returns a URL for viewing a file in the browser.
 * Memoized to avoid unnecessary recomputation.
 * @param params - The bucket ID, file ID, and optional access token.
 */
export function useFileView({
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
    () => storage?.getFileView({ bucketId, fileId, token }),
    [storage, bucketId, fileId, token],
  )

  return url
}
