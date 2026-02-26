import { useMemo } from 'react'

import { useAppwrite } from '../useAppwrite'

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
