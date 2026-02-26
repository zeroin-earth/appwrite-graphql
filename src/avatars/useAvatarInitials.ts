import { useMemo } from 'react'

import { useAppwrite } from '../useAppwrite'

export function useAvatarInitials({
  name,
  width,
  height,
  background,
}: {
  name?: string
  width?: number
  height?: number
  background?: string
} = {}) {
  const { avatars } = useAppwrite()

  const url = useMemo(
    () => avatars?.getInitials({ name, width, height, background }),
    [avatars, name, width, height, background],
  )

  return url
}
