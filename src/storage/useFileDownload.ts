import { useMemo } from 'react'

import { useAppwrite } from '../useAppwrite'

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
