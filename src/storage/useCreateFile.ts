import { Keys } from '../query/Keys'
import type { AppwriteException, Models } from '../types'
import { useAppwrite } from '../useAppwrite'
import { useMutation } from '../useMutation'
import { useQueryClient } from '../useQueryClient'

/** The variables accepted by the {@link useCreateFile} hook. */
export type CreateFileVariables = {
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

/** The result returned by the {@link useCreateFile} hook's mutation. */
export type CreateFileResult = Models.File

/**
 * Mutation to upload a file to a storage bucket.
 *
 * Uses the Appwrite Storage SDK directly (not GraphQL) to support chunked uploads
 * with progress tracking. Invalidates the file list cache for the target bucket on success.
 *
 * @example
 * ```tsx
 * const { mutate, isPending } = useCreateFile()
 *
 * mutate({
 *   bucketId: 'avatars',
 *   fileId: ID.unique(),
 *   file: selectedFile,
 *   permissions: ['read("any")'],
 *   onProgress: ({ progress }) => console.log(`${progress}%`),
 * })
 * ```
 *
 * **Variables** ({@link CreateFileVariables}):
 * - `bucketId` — The ID of the storage bucket to upload into
 * - `fileId` — A unique ID for the new file (use `ID.unique()` to auto-generate)
 * - `file` — The `File` object to upload
 * - `permissions` — Optional. An array of permission strings for the file
 * - `onProgress` — Optional. Callback invoked with upload progress details
 *
 * @returns A `UseMutationResult` whose `data` is the created {@link CreateFileResult | File} metadata.
 */
export function useCreateFile() {
  const { storage } = useAppwrite()
  const queryClient = useQueryClient()

  const mutationResult = useMutation<CreateFileResult, AppwriteException[], CreateFileVariables>({
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

  return mutationResult
}
