import { AppwriteException } from '../types'

import { gql } from '../__generated__'
import {
  UpsertDocumentsMutation,
  UpsertDocumentsMutationVariables,
} from '../__generated__/graphql'
import { useAppwrite } from '../useAppwrite'
import { useMutation } from '../useMutation'
import { useQueryClient } from '../useQueryClient'

const upsertDocuments = gql(/* GraphQL */ `
  mutation UpsertDocuments(
    $databaseId: String!
    $collectionId: String!
    $documents: [Json!]!
  ) {
    databasesUpsertDocuments(
      databaseId: $databaseId
      collectionId: $collectionId
      documents: $documents
    ) {
      total
      documents {
        _id
      }
    }
  }
`)

export function useUpsertDocuments() {
  const { graphql } = useAppwrite()
  const queryClient = useQueryClient()

  const mutationResult = useMutation<
    UpsertDocumentsMutation['databasesUpsertDocuments'],
    AppwriteException[],
    UpsertDocumentsMutationVariables
  >({
    mutationFn: async ({ databaseId, collectionId, documents }) => {
      const { data: mutationData, errors } = await graphql.mutation({
        query: upsertDocuments,
        variables: {
          databaseId,
          collectionId,
          documents: documents.map((doc) => JSON.stringify(doc)),
        },
      })

      if (errors) {
        throw errors
      }

      return mutationData.databasesUpsertDocuments
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['appwrite', 'databases', variables.databaseId, variables.collectionId],
      })
    },
  })

  return { ...mutationResult }
}
