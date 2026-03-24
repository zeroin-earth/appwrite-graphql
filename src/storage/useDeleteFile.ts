import type { ResultOf, VariablesOf } from 'gql.tada'
import { graphql as gql } from 'gql.tada'

import { Keys } from '../query/Keys'
import type { AppwriteException, Prettify } from '../types'
import { useAppwrite } from '../useAppwrite'
import { useMutation } from '../useMutation'
import { useQueryClient } from '../useQueryClient'

export const deleteFile = gql(/* GraphQL */ `
  mutation DeleteFile($bucketId: String!, $fileId: String!) {
    storageDeleteFile(bucketId: $bucketId, fileId: $fileId) {
      status
    }
  }
`)

/** The variables accepted by the {@link useDeleteFile} hook. */
export type DeleteFileVariables = Prettify<VariablesOf<typeof deleteFile>>

/** The result returned by the {@link useDeleteFile} hook. */
export type DeleteFileResult = Prettify<ResultOf<typeof deleteFile>['storageDeleteFile']>

/**
 * Mutation to delete a file from a storage bucket.
 *
 * Sends the `DeleteFile` GraphQL mutation. On success, removes the individual file
 * query from the cache and invalidates the file list cache for the target bucket.
 *
 * @example
 * ```tsx
 * const { mutate, isPending } = useDeleteFile()
 *
 * mutate({
 *   bucketId: 'avatars',
 *   fileId: '64a1b2c3d4e5f',
 * })
 * ```
 *
 * **Variables** ({@link DeleteFileVariables}):
 * - `bucketId` — The ID of the storage bucket containing the file
 * - `fileId` — The ID of the file to delete
 *
 * @returns A `UseMutationResult` whose `data` is a {@link DeleteFileResult} with a `status` field.
 */
export function useDeleteFile() {
  const { graphql } = useAppwrite()
  const queryClient = useQueryClient()

  const mutationResult = useMutation<DeleteFileResult, AppwriteException[], DeleteFileVariables>({
    mutationKey: Keys.buckets().files().delete(),
    mutationFn: async ({ bucketId, fileId }) => {
      const { data, errors } = await graphql.mutation({
        query: deleteFile,
        variables: { bucketId, fileId },
      })

      if (errors) {
        throw errors
      }

      return data?.storageDeleteFile ?? { status: '' }
    },
    onSuccess: (_, variables) => {
      queryClient.removeQueries({
        queryKey: Keys.bucket(variables.bucketId).file(variables.fileId).key(),
      })
      void queryClient.invalidateQueries({
        queryKey: Keys.bucket(variables.bucketId).files().key(),
      })
    },
  })

  return mutationResult
}
