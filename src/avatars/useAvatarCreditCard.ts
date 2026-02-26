import { useMemo } from 'react'
import type { CreditCard } from 'appwrite'

import { useAppwrite } from '../useAppwrite'

export function useAvatarCreditCard({
  code,
  width,
  height,
  quality,
}: {
  code: CreditCard
  width?: number
  height?: number
  quality?: number
}) {
  const { avatars } = useAppwrite()

  const url = useMemo(
    () => avatars?.getCreditCard({ code, width, height, quality }),
    [avatars, code, width, height, quality],
  )

  return url
}
