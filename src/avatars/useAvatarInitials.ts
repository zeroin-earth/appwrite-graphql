import { useMemo } from 'react'

import { useAppwrite } from '../useAppwrite'

/**
 * Returns a URL for an avatar with user initials.
 * Uses the current user's name if none provided. Memoized.
 * @param params - Optional name, width, height, and background color.
 */
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
