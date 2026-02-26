import { useMemo } from 'react'

import { useAppwrite } from '../useAppwrite'

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
