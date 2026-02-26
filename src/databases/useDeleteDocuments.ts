import { AppwriteException } from '../types'

import { gql } from '../__generated__'
import {
  DeleteDocumentsMutation,
  DeleteDocumentsMutationVariables,
} from '../__generated__/graphql'
import { useAppwrite } from '../useAppwrite'
import { useMutation } from '../useMutation'
import { useQueryClient } from '../useQueryClient'

const deleteDocuments = gql(/* GraphQL */ `
  mutation DeleteDocuments(
    $databaseId: String!
    $collectionId: String!
    $queries: [String!]
  ) {
    databasesDeleteDocuments(
      databaseId: $databaseId
      collectionId: $collectionId
      queries: $queries
    ) {
      total
      documents {
        _id
      }
    }
  }
`)

export function useDeleteDocuments() {
  const { graphql } = useAppwrite()
  const queryClient = useQueryClient()

  const mutationResult = useMutation<
    DeleteDocumentsMutation['databasesDeleteDocuments'],
    AppwriteException[],
    DeleteDocumentsMutationVariables
  >({
    mutationFn: async ({ databaseId, collectionId, queries }) => {
      const { data: mutationData, errors } = await graphql.mutation({
        query: deleteDocuments,
        variables: {
          databaseId,
          collectionId,
          queries,
        },
      })

      if (errors) {
        throw errors
      }

      return mutationData?.databasesDeleteDocuments ?? { total: 0, documents: [] }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['appwrite', 'databases', variables.databaseId, variables.collectionId],
      })
    },
  })

  return { ...mutationResult }
}
