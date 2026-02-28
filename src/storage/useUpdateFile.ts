import { gql } from '../__generated__'
import type { UpdateFileMutation, UpdateFileMutationVariables } from '../__generated__/graphql'
import type { AppwriteException } from '../types'
import { useAppwrite } from '../useAppwrite'
import { useMutation } from '../useMutation'
import { useQueryClient } from '../useQueryClient'

const updateFile = gql(/* GraphQL */ `
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

export function useUpdateFile() {
  const { graphql } = useAppwrite()
  const queryClient = useQueryClient()

  const mutationResult = useMutation<
    UpdateFileMutation['storageUpdateFile'],
    AppwriteException[],
    UpdateFileMutationVariables
  >({
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
        queryKey: ['appwrite', 'storage', variables.bucketId, 'files'],
      })
    },
  })

  return { ...mutationResult }
}
