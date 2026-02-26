import { AppwriteException } from '../types'

import { gql } from '../__generated__'
import { DeleteFileMutation, DeleteFileMutationVariables } from '../__generated__/graphql'
import { useAppwrite } from '../useAppwrite'
import { useMutation } from '../useMutation'
import { useQueryClient } from '../useQueryClient'

const deleteFile = gql(/* GraphQL */ `
  mutation DeleteFile($bucketId: String!, $fileId: String!) {
    storageDeleteFile(bucketId: $bucketId, fileId: $fileId) {
      status
    }
  }
`)

export function useDeleteFile() {
  const { graphql } = useAppwrite()
  const queryClient = useQueryClient()

  const mutationResult = useMutation<
    DeleteFileMutation['storageDeleteFile'],
    AppwriteException[],
    DeleteFileMutationVariables
  >({
    mutationFn: async ({ bucketId, fileId }) => {
      const { data, errors } = await graphql.mutation({
        query: deleteFile,
        variables: { bucketId, fileId },
      })

      if (errors) {
        throw errors
      }

      return data?.storageDeleteFile ?? { status: true }
    },
    onSuccess: (_, variables) => {
      queryClient.removeQueries({
        queryKey: ['appwrite', 'storage', variables.bucketId, 'files', variables.fileId],
      })
      queryClient.invalidateQueries({
        queryKey: ['appwrite', 'storage', variables.bucketId, 'files'],
      })
    },
  })

  return { ...mutationResult }
}
