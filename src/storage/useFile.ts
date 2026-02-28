import { gql } from '../__generated__'
import type { GetFileQuery, GetFileQueryVariables } from '../__generated__/graphql'
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

export function useFile({ bucketId, fileId }: GetFileQueryVariables) {
  const { graphql } = useAppwrite()

  const queryResult = useQuery<
    GetFileQuery['storageGetFile'],
    AppwriteException[],
    GetFileQuery['storageGetFile']
  >({
    queryKey: ['appwrite', 'storage', bucketId, 'files', fileId],
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
