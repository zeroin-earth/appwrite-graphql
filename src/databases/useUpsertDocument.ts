import { AppwriteException } from '../types'

import { gql } from '../__generated__'
import {
  InputMaybe,
  Scalars,
  UpsertDocumentMutation,
  UpsertDocumentMutationVariables,
} from '../__generated__/graphql'
import { useAppwrite } from '../useAppwrite'
import { useMutation } from '../useMutation'
import { useQueryClient } from '../useQueryClient'

const upsertDocument = gql(/* GraphQL */ `
  mutation UpsertDocument(
    $databaseId: String!
    $collectionId: String!
    $documentId: String!
    $data: Json!
    $permissions: [String!]
  ) {
    databasesUpsertDocument(
      databaseId: $databaseId
      collectionId: $collectionId
      documentId: $documentId
      data: $data
      permissions: $permissions
    ) {
      _id
    }
  }
`)

export function useUpsertDocument() {
  const { graphql } = useAppwrite()
  const queryClient = useQueryClient()

  const mutationResult = useMutation<
    UpsertDocumentMutation['databasesUpsertDocument'],
    AppwriteException[],
    Omit<UpsertDocumentMutationVariables, 'permissions'> & {
      permissions?: InputMaybe<Array<Scalars['String']['input']>>
    }
  >({
    mutationFn: async ({ databaseId, collectionId, documentId, data, permissions }) => {
      const { data: mutationData, errors } = await graphql.mutation({
        query: upsertDocument,
        variables: {
          databaseId,
          collectionId,
          documentId,
          data: JSON.stringify(data),
          permissions,
        },
      })

      if (errors) {
        throw errors
      }

      return mutationData.databasesUpsertDocument
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['appwrite', 'databases', variables.databaseId, variables.collectionId],
      })
    },
  })

  return { ...mutationResult }
}
