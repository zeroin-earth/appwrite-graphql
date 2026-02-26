import { AppwriteException } from '../types'

import { gql } from '../__generated__'
import {
  IncrementDocumentAttributeMutation,
  IncrementDocumentAttributeMutationVariables,
} from '../__generated__/graphql'
import { useAppwrite } from '../useAppwrite'
import { useMutation } from '../useMutation'
import { useQueryClient } from '../useQueryClient'

const incrementDocumentAttribute = gql(/* GraphQL */ `
  mutation IncrementDocumentAttribute(
    $databaseId: String!
    $collectionId: String!
    $documentId: String!
    $attribute: String!
    $value: Int
    $max: Int
  ) {
    databasesIncrementDocumentAttribute(
      databaseId: $databaseId
      collectionId: $collectionId
      documentId: $documentId
      attribute: $attribute
      value: $value
      max: $max
    ) {
      _id
      data
    }
  }
`)

export function useIncrementAttribute() {
  const { graphql } = useAppwrite()
  const queryClient = useQueryClient()

  const mutationResult = useMutation<
    IncrementDocumentAttributeMutation['databasesIncrementDocumentAttribute'],
    AppwriteException[],
    IncrementDocumentAttributeMutationVariables
  >({
    mutationFn: async ({ databaseId, collectionId, documentId, attribute, value, max }) => {
      const { data: mutationData, errors } = await graphql.mutation({
        query: incrementDocumentAttribute,
        variables: { databaseId, collectionId, documentId, attribute, value, max },
      })

      if (errors) {
        throw errors
      }

      return mutationData.databasesIncrementDocumentAttribute
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['appwrite', 'databases', variables.databaseId, variables.collectionId],
      })
    },
  })

  return { ...mutationResult }
}
