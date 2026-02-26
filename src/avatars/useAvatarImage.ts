import { useMemo } from 'react'

import { useAppwrite } from '../useAppwrite'

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
