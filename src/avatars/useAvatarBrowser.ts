import { useMemo } from 'react'
import type { Browser } from 'appwrite'

import { useAppwrite } from '../useAppwrite'

export function useAvatarBrowser({
  code,
  width,
  height,
  quality,
}: {
  code: Browser
  width?: number
  height?: number
  quality?: number
}) {
  const { avatars } = useAppwrite()

  const url = useMemo(
    () => avatars?.getBrowser({ code, width, height, quality }),
    [avatars, code, width, height, quality],
  )

  return url
}
