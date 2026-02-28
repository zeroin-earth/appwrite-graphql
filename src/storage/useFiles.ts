import { gql } from '../__generated__'
import type { ListFilesQuery } from '../__generated__/graphql'
import type { AppwriteException } from '../types'
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

  const queryResult = useQuery<
    ListFilesQuery['storageListFiles'],
    AppwriteException[],
    ListFilesQuery['storageListFiles']
  >({
    queryKey: ['appwrite', 'storage', bucketId, 'files', { queries, search }],
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

  return { ...queryResult }
}
