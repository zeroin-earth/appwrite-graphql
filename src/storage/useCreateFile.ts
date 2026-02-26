import { AppwriteException } from '../types'

import { gql } from '../__generated__'
import { CreateFileMutation, CreateFileMutationVariables } from '../__generated__/graphql'
import { useAppwrite } from '../useAppwrite'
import { useMutation } from '../useMutation'
import { useQueryClient } from '../useQueryClient'

const createFile = gql(/* GraphQL */ `
  mutation CreateFile(
    $bucketId: String!
    $fileId: String!
    $file: String!
    $permissions: [String!]
  ) {
    storageCreateFile(
      bucketId: $bucketId
      fileId: $fileId
      file: $file
      permissions: $permissions
    ) {
      _id
      bucketId
      name
      mimeType
      sizeOriginal
    }
  }
`)

export function useCreateFile() {
  const { graphql } = useAppwrite()
  const queryClient = useQueryClient()

  const mutationResult = useMutation<
    CreateFileMutation['storageCreateFile'],
    AppwriteException[],
    CreateFileMutationVariables
  >({
    mutationFn: async ({ bucketId, fileId, file, permissions }) => {
      const { data, errors } = await graphql.mutation({
        query: createFile,
        variables: { bucketId, fileId, file, permissions },
      })

      if (errors) {
        throw errors
      }

      return data.storageCreateFile
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['appwrite', 'storage', variables.bucketId, 'files'],
      })
    },
  })

  return { ...mutationResult }
}
