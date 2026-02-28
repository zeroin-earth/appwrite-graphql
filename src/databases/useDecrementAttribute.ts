import { gql } from '../__generated__'
import type {
  DecrementDocumentAttributeMutation,
  DecrementDocumentAttributeMutationVariables,
} from '../__generated__/graphql'
import type { AppwriteException } from '../types'
import { useAppwrite } from '../useAppwrite'
import { useMutation } from '../useMutation'
import { useQueryClient } from '../useQueryClient'

const decrementDocumentAttribute = gql(/* GraphQL */ `
  mutation DecrementDocumentAttribute(
    $databaseId: String!
    $collectionId: String!
    $documentId: String!
    $attribute: String!
    $value: Int
    $min: Int
  ) {
    databasesDecrementDocumentAttribute(
      databaseId: $databaseId
      collectionId: $collectionId
      documentId: $documentId
      attribute: $attribute
      value: $value
      min: $min
    ) {
      _id
      data
    }
  }
`)

export function useDecrementAttribute() {
  const { graphql } = useAppwrite()
  const queryClient = useQueryClient()

  const mutationResult = useMutation<
    DecrementDocumentAttributeMutation['databasesDecrementDocumentAttribute'],
    AppwriteException[],
    DecrementDocumentAttributeMutationVariables
  >({
    mutationFn: async ({ databaseId, collectionId, documentId, attribute, value, min }) => {
      const { data: mutationData, errors } = await graphql.mutation({
        query: decrementDocumentAttribute,
        variables: { databaseId, collectionId, documentId, attribute, value, min },
      })

      if (errors) {
        throw errors
      }

      return mutationData.databasesDecrementDocumentAttribute
    },
    onSuccess: (_, variables) => {
      void queryClient.invalidateQueries({
        queryKey: ['appwrite', 'databases', variables.databaseId, variables.collectionId],
      })
    },
  })

  return { ...mutationResult }
}
