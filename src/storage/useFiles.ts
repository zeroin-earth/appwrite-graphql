import type { ResultOf } from 'gql.tada'
import { graphql as gql } from 'gql.tada'

import { Keys } from '../query/Keys'
import type { AppwriteException, Prettify } from '../types'
import { useAppwrite } from '../useAppwrite'
import { useQuery } from '../useQuery'

const listFiles = gql(/* GraphQL */ `
  query ListFiles($bucketId: String!, $queries: [String!], $search: String) {
    storageListFiles(bucketId: $bucketId, queries: $queries, search: $search) {
      total
      files {
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
  }
`)

/** The result returned by the {@link useFiles} hook. */
export type FilesResult = Prettify<ResultOf<typeof listFiles>['storageListFiles']>

/**
 * Fetches a list of files from a storage bucket with optional query filters and search.
 *
 * @example
 * ```tsx
 * const { data, isLoading } = useFiles({
 *   bucketId: 'images',
 *   queries: ['limit(25)'],
 * })
 *
 * // data.total, data.files
 * ```
 *
 * **Parameters:**
 * - `bucketId` — The storage bucket identifier.
 * - `queries` *(optional)* — Appwrite query strings for filtering and pagination.
 * - `search` *(optional)* — A search term to filter files by name.
 *
 * @returns A `UseQueryResult` with the paginated file list ({@link FilesResult}).
 */
export function useFiles({
  bucketId,
  queries,
  search,
}: {
  bucketId: string
  queries?: string[]
  search?: string
}) {
  const { graphql } = useAppwrite()

  const queryResult = useQuery<FilesResult, AppwriteException[], FilesResult>({
    queryKey: [
      ...Keys.bucket(bucketId).files().key(),
      ...(queries ?? []),
      ...(search ? [search] : []),
    ],
    queryFn: async () => {
      const { data, errors } = await graphql.query({
        query: listFiles,
        variables: { bucketId, queries, search },
      })

      if (errors) {
        throw errors
      }

      return data.storageListFiles
    },
  })

  return queryResult
}
