import type { ResultOf, VariablesOf } from 'gql.tada'
import { graphql as gql } from 'gql.tada'

import { Keys } from '../query/Keys'
import type { AppwriteException, Prettify } from '../types'
import { useAppwrite } from '../useAppwrite'
import { useMutation } from '../useMutation'
import { useQueryClient } from '../useQueryClient'

export const decrementDocumentAttribute = gql(/* GraphQL */ `
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

/** The variables accepted by the {@link useDecrementAttribute} mutation. */
export type DecrementAttributeVariables = Prettify<VariablesOf<typeof decrementDocumentAttribute>>

/** The result returned by the {@link useDecrementAttribute} mutation. */
export type DecrementAttributeResult = Prettify<
  ResultOf<typeof decrementDocumentAttribute>['databasesDecrementDocumentAttribute']
>

/**
 * Mutation hook to atomically decrement a numeric document attribute with optimistic updates.
 *
 * Accepts an optional `value` (default: 1) and `min` floor. The optimistic update
 * immediately reflects the new value in the cache and rolls back on error.
 *
 * @example
 * ```tsx
 * const { mutate } = useDecrementAttribute()
 *
 * // Decrement "lives" by 1
 * mutate({
 *   databaseId: 'my-db',
 *   collectionId: 'players',
 *   documentId: 'player-1',
 *   attribute: 'lives',
 * })
 *
 * // Decrement "balance" by 50, floored at 0
 * mutate({
 *   databaseId: 'my-db',
 *   collectionId: 'accounts',
 *   documentId: 'acct-1',
 *   attribute: 'balance',
 *   value: 50,
 *   min: 0,
 * })
 * ```
 *
 * **Variables** ({@link DecrementAttributeVariables}):
 * - `databaseId` — The target database ID
 * - `collectionId` — The target collection ID
 * - `documentId` — The ID of the document containing the attribute
 * - `attribute` — The name of the numeric attribute to decrement
 * - `value` — Optional decrement amount (defaults to `1`)
 * - `min` — Optional minimum floor; the attribute will not go below this value
 * - `transactionId` — Optional transaction ID for atomic operations
 *
 * @returns A `UseMutationResult` with the document's `_id` and updated `data`.
 */
export function useDecrementAttribute() {
  const { graphql } = useAppwrite()
  const queryClient = useQueryClient()

  const mutationResult = useMutation<
    DecrementAttributeResult,
    AppwriteException[],
    DecrementAttributeVariables,
    {
      previousEntries: [queryKey: readonly unknown[], data: unknown][]
      documentKeyPrefix: readonly unknown[]
    }
  >({
    mutationKey: [...Keys.databases().transactions().operations().key(), 'decrementAttribute'],
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
        variables: {
          databaseId,
          collectionId,
          documentId,
          attribute,
          value,
          min,
          transactionId,
        },
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

      const previousEntries = queryClient.getQueriesData({
        queryKey: documentKeyPrefix,
      })

      queryClient.setQueryData<DecrementAttributeVariables>(documentKeyPrefix, (old) => {
        if (!old) return old
        const current = (old[variables.attribute] as number) ?? 0
        const decrement = variables.value ?? 1
        const newValue =
          variables.min != null ? Math.max(current - decrement, variables.min) : current - decrement

        return { ...old, [variables.attribute]: newValue }
      })

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

  return mutationResult
}
