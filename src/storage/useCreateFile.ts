import { Keys } from '../query/Keys'
import type { AppwriteException, Models } from '../types'
import { useAppwrite } from '../useAppwrite'
import { useMutation } from '../useMutation'
import { useQueryClient } from '../useQueryClient'

type CreateFileVariables = {
  bucketId: string
  fileId: string
  file: File
  permissions?: string[]
  onProgress?: (progress: {
    $id: string
    progress: number
    sizeUploaded: number
    chunksTotal: number
    chunksUploaded: number
  }) => void
}

export function useCreateFile() {
  const { storage } = useAppwrite()
  const queryClient = useQueryClient()

  const mutationResult = useMutation<Models.File, AppwriteException[], CreateFileVariables>({
    mutationKey: Keys.buckets().files().create(),
    mutationFn: async ({ bucketId, fileId, file, permissions, onProgress }) => {
      return storage.createFile({
        bucketId,
        fileId,
        file,
        permissions,
        onProgress,
      })
    },
    onSuccess: (_, variables) => {
      void queryClient.invalidateQueries({
        queryKey: Keys.bucket(variables.bucketId).files().key(),
      })
    },
  })

  return { ...mutationResult }
}
