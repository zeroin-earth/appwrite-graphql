import { gql } from '../__generated__'
import type {
  DeleteDocumentMutation,
  DeleteDocumentMutationVariables,
} from '../__generated__/graphql'
import type { AppwriteException } from '../types'
import { useAppwrite } from '../useAppwrite'
import { useMutation } from '../useMutation'
import { useQueryClient } from '../useQueryClient'

const deleteDocument = gql(/* GraphQL */ `
  mutation DeleteDocument($databaseId: String!, $collectionId: String!, $documentId: String!, $transactionId: String) {
    databasesDeleteDocument(
      databaseId: $databaseId
      collectionId: $collectionId
      documentId: $documentId
      transactionId: $transactionId
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
    DeleteDocumentMutationVariables,
    { previousEntries: [queryKey: readonly unknown[], data: unknown][]; documentKeyPrefix: readonly unknown[] }
  >({
    mutationFn: async ({ databaseId, collectionId, documentId, transactionId }) => {
      const { data: mutationData, errors } = await graphql.mutation({
        query: deleteDocument,
        variables: {
          databaseId,
          collectionId,
          documentId,
          transactionId,
        },
      })

      if (errors) {
        throw errors
      }

      return mutationData?.databasesDeleteDocument ?? { status: '' }
    },
    onMutate: async (variables) => {
      const documentKeyPrefix = [
        'appwrite',
        'databases',
        variables.databaseId,
        variables.collectionId,
        'documents',
        variables.documentId,
      ]

      await queryClient.cancelQueries({ queryKey: documentKeyPrefix })

      const previousEntries = queryClient.getQueriesData({ queryKey: documentKeyPrefix })

      queryClient.removeQueries({ queryKey: documentKeyPrefix })

      return { previousEntries, documentKeyPrefix }
    },
    onError: (_, __, context) => {
      if (context?.previousEntries) {
        for (const [key, data] of context.previousEntries) {
          queryClient.setQueryData(key, data)
        }
      }
    },
    onSettled: (_, __, variables) => {
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
      void queryClient.invalidateQueries({
        queryKey: ['appwrite', 'databases', variables.databaseId, variables.collectionId],
      })
    },
  })

  return { ...mutationResult }
}
