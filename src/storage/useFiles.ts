import type { ResultOf } from 'gql.tada'
import { graphql as gql } from 'gql.tada'

import { Keys } from '../query/Keys'
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

type Result = ResultOf<typeof listFiles>['storageListFiles']

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

  const queryResult = useQuery<Result, AppwriteException[], Result>({
    queryKey: [...Keys.bucket(bucketId).files().key(), ...(queries ?? []), ...(search ? [search] : [])],
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
