import { AppwriteException } from '../types'

import { gql } from '../__generated__'
import {
  CreateDocumentsMutation,
  CreateDocumentsMutationVariables,
} from '../__generated__/graphql'
import { useAppwrite } from '../useAppwrite'
import { useMutation } from '../useMutation'
import { useQueryClient } from '../useQueryClient'

const createDocuments = gql(/* GraphQL */ `
  mutation CreateDocuments(
    $databaseId: String!
    $collectionId: String!
    $documents: [Json!]!
  ) {
    databasesCreateDocuments(
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

export function useCreateDocuments() {
  const { graphql } = useAppwrite()
  const queryClient = useQueryClient()

  const mutationResult = useMutation<
    CreateDocumentsMutation['databasesCreateDocuments'],
    AppwriteException[],
    CreateDocumentsMutationVariables
  >({
    mutationFn: async ({ databaseId, collectionId, documents }) => {
      const { data: mutationData, errors } = await graphql.mutation({
        query: createDocuments,
        variables: {
          databaseId,
          collectionId,
          documents: documents.map((doc) => JSON.stringify(doc)),
        },
      })

      if (errors) {
        throw errors
      }

      return mutationData.databasesCreateDocuments
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['appwrite', 'databases', variables.databaseId, variables.collectionId],
      })
    },
  })

  return { ...mutationResult }
}
