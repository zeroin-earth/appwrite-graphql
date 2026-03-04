import type { ResultOf, VariablesOf } from 'gql.tada'
import { graphql as gql } from 'gql.tada'

import { Keys } from '../query/Keys'
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
    $transactionId: String
  ) {
    databasesDecrementDocumentAttribute(
      databaseId: $databaseId
      collectionId: $collectionId
      documentId: $documentId
      attribute: $attribute
      value: $value
      min: $min
      transactionId: $transactionId
    ) {
      _id
      data
    }
  }
`)

type Variables = VariablesOf<typeof decrementDocumentAttribute>
type Result = ResultOf<typeof decrementDocumentAttribute>['databasesDecrementDocumentAttribute']

export function useDecrementAttribute() {
  const { graphql } = useAppwrite()
  const queryClient = useQueryClient()

  const mutationResult = useMutation<
    Result,
    AppwriteException[],
    Variables,
    {
      previousEntries: [queryKey: readonly unknown[], data: unknown][]
      documentKeyPrefix: readonly unknown[]
    }
  >({
    mutationKey: Keys.database().transactions().operations().key(),
    mutationFn: async ({
      databaseId,
      collectionId,
      documentId,
      attribute,
      value,
      min,
      transactionId,
    }) => {
      const { data: mutationData, errors } = await graphql.mutation({
        query: decrementDocumentAttribute,
        variables: { databaseId, collectionId, documentId, attribute, value, min, transactionId },
      })

      if (errors) {
        throw errors
      }

      return mutationData.databasesDecrementDocumentAttribute
    },
    onMutate: async (variables) => {
      const documentKeyPrefix = Keys.database(variables.databaseId)
        .collection(variables.collectionId)
        .document(variables.documentId)
        .key()

      await queryClient.cancelQueries({ queryKey: documentKeyPrefix })

      const previousEntries = queryClient.getQueriesData({ queryKey: documentKeyPrefix })

      queryClient.setQueriesData(
        { queryKey: documentKeyPrefix },
        (old: Record<string, unknown> | undefined) => {
          if (!old) return old
          const current = (old[variables.attribute] as number) ?? 0
          const decrement = variables.value ?? 1
          const newValue =
            variables.min != null
              ? Math.max(current - decrement, variables.min)
              : current - decrement

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
        queryKey: Keys.database(variables.databaseId).collection(variables.collectionId).key(),
      })
    },
  })

  return { ...mutationResult }
}
