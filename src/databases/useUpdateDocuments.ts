import { gql } from '../__generated__'
import type {
  UpdateDocumentsMutation,
  UpdateDocumentsMutationVariables,
} from '../__generated__/graphql'
import type { AppwriteException } from '../types'
import { useAppwrite } from '../useAppwrite'
import { useMutation } from '../useMutation'
import { useQueryClient } from '../useQueryClient'

const updateDocuments = gql(/* GraphQL */ `
  mutation UpdateDocuments(
    $databaseId: String!
    $collectionId: String!
    $data: Json
    $queries: [String!]
  ) {
    databasesUpdateDocuments(
      databaseId: $databaseId
      collectionId: $collectionId
      data: $data
      queries: $queries
    ) {
      total
      documents {
        _id
      }
    }
  }
`)

export function useUpdateDocuments() {
  const { graphql } = useAppwrite()
  const queryClient = useQueryClient()

  const mutationResult = useMutation<
    UpdateDocumentsMutation['databasesUpdateDocuments'],
    AppwriteException[],
    UpdateDocumentsMutationVariables
  >({
    mutationFn: async ({ databaseId, collectionId, data, queries }) => {
      const { data: mutationData, errors } = await graphql.mutation({
        query: updateDocuments,
        variables: {
          databaseId,
          collectionId,
          data: data ? JSON.stringify(data) : undefined,
          queries,
        },
      })

      if (errors) {
        throw errors
      }

      return mutationData.databasesUpdateDocuments
    },
    onSuccess: (_, variables) => {
      void queryClient.invalidateQueries({
        queryKey: ['appwrite', 'databases', variables.databaseId, variables.collectionId],
      })
    },
  })

  return { ...mutationResult }
}
