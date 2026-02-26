import { useMemo } from 'react'
import type { ImageFormat, ImageGravity } from 'appwrite'

import { useAppwrite } from '../useAppwrite'

export function useFilePreview({
  bucketId,
  fileId,
  width,
  height,
  gravity,
  quality,
  borderWidth,
  borderColor,
  borderRadius,
  opacity,
  rotation,
  background,
  output,
  token,
}: {
  bucketId: string
  fileId: string
  width?: number
  height?: number
  gravity?: ImageGravity
  quality?: number
  borderWidth?: number
  borderColor?: string
  borderRadius?: number
  opacity?: number
  rotation?: number
  background?: string
  output?: ImageFormat
  token?: string
}) {
  const { storage } = useAppwrite()

  const url = useMemo(
    () =>
      storage?.getFilePreview({
        bucketId,
        fileId,
        width,
        height,
        gravity,
        quality,
        borderWidth,
        borderColor,
        borderRadius,
        opacity,
        rotation,
        background,
        output,
        token,
      }),
    [
      storage,
      bucketId,
      fileId,
      width,
      height,
      gravity,
      quality,
      borderWidth,
      borderColor,
      borderRadius,
      opacity,
      rotation,
      background,
      output,
      token,
    ],
  )

  return url
}
