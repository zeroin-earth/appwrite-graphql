import type { ResultOf, VariablesOf } from 'gql.tada'
import { graphql as gql } from 'gql.tada'

import { Keys } from '../query/Keys'
import type { AppwriteException } from '../types'
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

type Variables = VariablesOf<typeof getFile>
type Result = ResultOf<typeof getFile>['storageGetFile']

export function useFile({ bucketId, fileId }: Variables) {
  const { graphql } = useAppwrite()

  const queryResult = useQuery<Result, AppwriteException[], Result>({
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

  return { ...queryResult }
}
