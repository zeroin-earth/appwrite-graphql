import { UseMutationOptions } from '@tanstack/react-query'
import { AppwriteException } from 'appwrite'

import { gql } from '../__generated__'
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

export function useDeleteDocument(
  databaseId: string,
  collectionId: string,
  documentId: string,
  options?: UseMutationOptions<boolean, AppwriteException, void, string[]>,
) {
  const { graphql } = useAppwrite()
  const queryClient = useQueryClient()

  const mutationResult = useMutation({
    mutationKey: ['appwrite', 'databases', databaseId, collectionId, 'documents', documentId],
    mutationFn: async () => {
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

      return mutationData.databasesDeleteDocument.status ?? false
    },
    ...options,
    onSuccess: async (data, variables, context) => {
      queryClient.setQueryData(
        ['appwrite', 'databases', databaseId, collectionId, 'documents', documentId],
        null,
      )
      queryClient.removeQueries({
        queryKey: ['appwrite', 'databases', databaseId, collectionId, 'documents', documentId],
      })
      options?.onSuccess?.(data, variables, context)
    },
  })

  return { ...mutationResult }
}
