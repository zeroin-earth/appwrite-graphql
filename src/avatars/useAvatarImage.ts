import { useMemo } from 'react'

import { useAppwrite } from '../useAppwrite'

/**
 * Returns a URL for a remote image cropped to a specified size. Memoized.
 * @param params - The image URL and optional width and height.
 */
export function useAvatarImage({
  url,
  width,
  height,
}: {
  url: string
  width?: number
  height?: number
}) {
  const { avatars } = useAppwrite()

  const imageUrl = useMemo(
    () => avatars?.getImage({ url, width, height }),
    [avatars, url, width, height],
  )

  return imageUrl
}
