import { useMemo } from 'react'

import { useAppwrite } from '../useAppwrite'

/**
 * Returns a URL for a screenshot of a website. Memoized.
 * @param params - The website URL and optional width and height.
 */
export function useAvatarScreenshot({
  url,
  width,
  height,
}: {
  url: string
  width?: number
  height?: number
}) {
  const { avatars } = useAppwrite()

  const screenshotUrl = useMemo(
    () => avatars?.getScreenshot({ url, width, height }),
    [avatars, url, width, height],
  )

  return screenshotUrl
}
