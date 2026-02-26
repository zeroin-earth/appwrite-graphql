import { useMemo } from 'react'

import { useAppwrite } from '../useAppwrite'

export function useAvatarFavicon({ url }: { url: string }) {
  const { avatars } = useAppwrite()

  const faviconUrl = useMemo(
    () => avatars?.getFavicon({ url }),
    [avatars, url],
  )

  return faviconUrl
}
