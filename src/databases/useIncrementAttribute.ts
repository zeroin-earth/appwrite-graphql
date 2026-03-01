import { gql } from '../__generated__'
import type {
  IncrementDocumentAttributeMutation,
  IncrementDocumentAttributeMutationVariables,
} from '../__generated__/graphql'
import type { AppwriteException } from '../types'
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
    $transactionId: String
  ) {
    databasesIncrementDocumentAttribute(
      databaseId: $databaseId
      collectionId: $collectionId
      documentId: $documentId
      attribute: $attribute
      value: $value
      max: $max
      transactionId: $transactionId
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
    IncrementDocumentAttributeMutationVariables,
    { previousEntries: [queryKey: readonly unknown[], data: unknown][]; documentKeyPrefix: readonly unknown[] }
  >({
    mutationFn: async ({ databaseId, collectionId, documentId, attribute, value, max, transactionId }) => {
      const { data: mutationData, errors } = await graphql.mutation({
        query: incrementDocumentAttribute,
        variables: { databaseId, collectionId, documentId, attribute, value, max, transactionId },
      })

      if (errors) {
        throw errors
      }

      return mutationData.databasesIncrementDocumentAttribute
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

      queryClient.setQueriesData(
        { queryKey: documentKeyPrefix },
        (old: Record<string, unknown> | undefined) => {
          if (!old) return old
          const current = (old[variables.attribute] as number) ?? 0
          const increment = variables.value ?? 1
          const newValue =
            variables.max != null ? Math.min(current + increment, variables.max) : current + increment

          return { ...old, [variables.attribute]: newValue }
        },
      )

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
      void queryClient.invalidateQueries({
        queryKey: ['appwrite', 'databases', variables.databaseId, variables.collectionId],
      })
    },
  })

  return { ...mutationResult }
}
