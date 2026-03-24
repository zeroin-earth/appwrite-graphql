import { useMemo } from 'react'
import type { Flag } from 'appwrite'

import { useAppwrite } from '../useAppwrite'

/**
 * Returns a URL for a country flag avatar image. Memoized.
 * @param params - The country code and optional width, height, and quality.
 */
export function useAvatarFlag({
  code,
  width,
  height,
  quality,
}: {
  code: Flag
  width?: number
  height?: number
  quality?: number
}) {
  const { avatars } = useAppwrite()

  const url = useMemo(
    () => avatars?.getFlag({ code, width, height, quality }),
    [avatars, code, width, height, quality],
  )

  return url
}
