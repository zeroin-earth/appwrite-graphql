import { gql } from '../__generated__'
import { DeleteDocumentMutation, DeleteDocumentMutationVariables } from '../__generated__/graphql'
import { AppwriteException } from '../types'
import { useAppwrite } from '../useAppwrite'
import { useMutation } from '../useMutation'
import { useQueryClient } from '../useQueryClient'

const deleteDocument = gql(/* GraphQL */ `
  mutation DeleteDocument($databaseId: String!, $collectionId: String!, $documentId: String!) {
    databasesDeleteDocument(
      databaseId: $databaseId
      collectionId: $collectionId
      documentId: $documentId
    ) {
      status
    }
  }
`)

export function useDeleteDocument() {
  const { graphql } = useAppwrite()
  const queryClient = useQueryClient()

  const mutationResult = useMutation<
    DeleteDocumentMutation['databasesDeleteDocument'],
    AppwriteException[],
    DeleteDocumentMutationVariables
  >({
    mutationFn: async ({ databaseId, collectionId, documentId }) => {
      const { data: mutationData, errors } = await graphql.mutation({
        query: deleteDocument,
        variables: {
          databaseId,
          collectionId,
          documentId,
        },
      })

      if (errors) {
        throw errors
      }

      return mutationData.databasesDeleteDocument
    },
    onSuccess: async (_, variables) => {
      queryClient.setQueryData(
        [
          'appwrite',
          'databases',
          variables.databaseId,
          variables.collectionId,
          'documents',
          variables.documentId,
        ],
        null,
      )
      queryClient.removeQueries({
        queryKey: [
          'appwrite',
          'databases',
          variables.databaseId,
          variables.collectionId,
          'documents',
          variables.documentId,
        ],
      })
    },
  })

  return { ...mutationResult }
}
