import { useMemo } from 'react'

import { useAppwrite } from '../useAppwrite'

/**
 * Returns a URL for a QR code image. Memoized.
 * @param params - The text to encode, and optional size, margin, and download flag.
 */
export function useAvatarQR({
  text,
  size,
  margin,
  download,
}: {
  text: string
  size?: number
  margin?: number
  download?: boolean
}) {
  const { avatars } = useAppwrite()

  const url = useMemo(
    () => avatars?.getQR({ text, size, margin, download }),
    [avatars, text, size, margin, download],
  )

  return url
}
