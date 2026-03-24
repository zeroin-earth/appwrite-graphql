import type { ResultOf, VariablesOf } from 'gql.tada'
import { graphql as gql } from 'gql.tada'

import { Keys } from '../query/Keys'
import type { AppwriteException, Prettify } from '../types'
import { useAppwrite } from '../useAppwrite'
import { useMutation } from '../useMutation'
import { useQueryClient } from '../useQueryClient'

export const updateFile = gql(/* GraphQL */ `
  mutation UpdateFile(
    $bucketId: String!
    $fileId: String!
    $name: String
    $permissions: [String!]
  ) {
    storageUpdateFile(
      bucketId: $bucketId
      fileId: $fileId
      name: $name
      permissions: $permissions
    ) {
      _id
      bucketId
      name
      _permissions
    }
  }
`)

/** The variables accepted by the {@link useUpdateFile} hook. */
export type UpdateFileVariables = Prettify<VariablesOf<typeof updateFile>>

/** The result returned by the {@link useUpdateFile} hook. */
export type UpdateFileResult = Prettify<ResultOf<typeof updateFile>['storageUpdateFile']>

/**
 * Mutation to update a file's name or permissions in a storage bucket.
 *
 * Sends the `UpdateFile` GraphQL mutation and invalidates the file list cache
 * for the target bucket on success.
 *
 * @example
 * ```tsx
 * const { mutate, isPending } = useUpdateFile()
 *
 * mutate({
 *   bucketId: 'avatars',
 *   fileId: '64a1b2c3d4e5f',
 *   name: 'profile-photo.png',
 *   permissions: ['read("any")', 'write("user:123")'],
 * })
 * ```
 *
 * **Variables** ({@link UpdateFileVariables}):
 * - `bucketId` — The ID of the storage bucket containing the file
 * - `fileId` — The ID of the file to update
 * - `name` — Optional. The new name for the file
 * - `permissions` — Optional. An updated array of permission strings
 *
 * @returns A `UseMutationResult` whose `data` is the updated {@link UpdateFileResult} with `_id`, `bucketId`, `name`, and `_permissions`.
 */
export function useUpdateFile() {
  const { graphql } = useAppwrite()
  const queryClient = useQueryClient()

  const mutationResult = useMutation<UpdateFileResult, AppwriteException[], UpdateFileVariables>({
    mutationKey: Keys.buckets().files().update(),
    mutationFn: async ({ bucketId, fileId, name, permissions }) => {
      const { data, errors } = await graphql.mutation({
        query: updateFile,
        variables: { bucketId, fileId, name, permissions },
      })

      if (errors) {
        throw errors
      }

      return data.storageUpdateFile
    },
    onSuccess: (_, variables) => {
      void queryClient.invalidateQueries({
        queryKey: Keys.bucket(variables.bucketId).files().key(),
      })
    },
  })

  return mutationResult
}
