import { useMemo } from 'react'

import { useAppwrite } from '../useAppwrite'

/**
 * Returns a URL for a website's favicon. Memoized.
 * @param params - The website URL to fetch the favicon for.
 */
export function useAvatarFavicon({ url }: { url: string }) {
  const { avatars } = useAppwrite()

  const faviconUrl = useMemo(() => avatars?.getFavicon({ url }), [avatars, url])

  return faviconUrl
}
