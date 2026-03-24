import type { ResultOf, VariablesOf } from 'gql.tada'
import { graphql as gql } from 'gql.tada'

import { Keys } from '../query/Keys'
import type { AppwriteException, Prettify } from '../types'
import { useAppwrite } from '../useAppwrite'
import { useQuery } from '../useQuery'

const getFile = gql(/* GraphQL */ `
  query GetFile($bucketId: String!, $fileId: String!) {
    storageGetFile(bucketId: $bucketId, fileId: $fileId) {
      _id
      bucketId
      _createdAt
      _updatedAt
      _permissions
      name
      signature
      mimeType
      sizeOriginal
      chunksTotal
      chunksUploaded
    }
  }
`)

/** The variables accepted by the {@link useFile} hook. */
export type FileVariables = Prettify<VariablesOf<typeof getFile>>

/** The result returned by the {@link useFile} hook. */
export type FileResult = Prettify<ResultOf<typeof getFile>['storageGetFile']>

/**
 * Fetches a single file's metadata from a storage bucket.
 *
 * @example
 * ```tsx
 * const { data, isLoading } = useFile({
 *   bucketId: 'images',
 *   fileId: '6482…',
 * })
 *
 * // data.name, data.mimeType, data.sizeOriginal, etc.
 * ```
 *
 * **Parameters** ({@link FileVariables}):
 * - `bucketId` — The storage bucket identifier.
 * - `fileId` — The unique file identifier.
 *
 * @returns A `UseQueryResult` with the file's metadata ({@link FileResult}).
 */
export function useFile({ bucketId, fileId }: FileVariables) {
  const { graphql } = useAppwrite()

  const queryResult = useQuery<FileResult, AppwriteException[], FileResult>({
    queryKey: Keys.bucket(bucketId).file(fileId).key(),
    queryFn: async () => {
      const { data, errors } = await graphql.query({
        query: getFile,
        variables: { bucketId, fileId },
      })

      if (errors) {
        throw errors
      }

      return data.storageGetFile
    },
  })

  return queryResult
}
