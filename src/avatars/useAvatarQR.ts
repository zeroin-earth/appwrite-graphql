import { useMemo } from 'react'

import { useAppwrite } from '../useAppwrite'

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
