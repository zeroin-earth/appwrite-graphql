import type { ResultOf, VariablesOf } from 'gql.tada'
import { graphql as gql } from 'gql.tada'

import { Keys } from '../query/Keys'
import type { AppwriteException, Prettify } from '../types'
import { useAppwrite } from '../useAppwrite'
import { useMutation } from '../useMutation'
import { useQueryClient } from '../useQueryClient'

export const incrementDocumentAttribute = gql(/* GraphQL */ `
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

/** The variables accepted by the {@link useIncrementAttribute} mutation. */
export type IncrementAttributeVariables = Prettify<VariablesOf<typeof incrementDocumentAttribute>>

/** The result returned by the {@link useIncrementAttribute} mutation. */
export type IncrementAttributeResult = Prettify<
  ResultOf<typeof incrementDocumentAttribute>['databasesIncrementDocumentAttribute']
>

/**
 * Mutation hook to atomically increment a numeric document attribute with optimistic updates.
 *
 * Accepts an optional `value` (default: 1) and `max` ceiling. The optimistic update
 * immediately reflects the new value in the cache and rolls back on error.
 *
 * @example
 * ```tsx
 * const { mutate } = useIncrementAttribute()
 *
 * // Increment "score" by 1
 * mutate({
 *   databaseId: 'my-db',
 *   collectionId: 'players',
 *   documentId: 'player-1',
 *   attribute: 'score',
 * })
 *
 * // Increment "lives" by 3, capped at 10
 * mutate({
 *   databaseId: 'my-db',
 *   collectionId: 'players',
 *   documentId: 'player-1',
 *   attribute: 'lives',
 *   value: 3,
 *   max: 10,
 * })
 * ```
 *
 * **Variables** ({@link IncrementAttributeVariables}):
 * - `databaseId` — The target database ID
 * - `collectionId` — The target collection ID
 * - `documentId` — The ID of the document containing the attribute
 * - `attribute` — The name of the numeric attribute to increment
 * - `value` — Optional increment amount (defaults to `1`)
 * - `max` — Optional maximum ceiling; the attribute will not exceed this value
 * - `transactionId` — Optional transaction ID for atomic operations
 *
 * @returns A `UseMutationResult` with the document's `_id` and updated `data`.
 */
export function useIncrementAttribute() {
  const { graphql } = useAppwrite()
  const queryClient = useQueryClient()

  const mutationResult = useMutation<
    IncrementAttributeResult,
    AppwriteException[],
    IncrementAttributeVariables,
    {
      previousEntries: [queryKey: readonly unknown[], data: unknown][]
      documentKeyPrefix: readonly unknown[]
    }
  >({
    mutationKey: [...Keys.databases().transactions().operations().key(), 'incrementAttribute'],
    mutationFn: async ({
      databaseId,
      collectionId,
      documentId,
      attribute,
      value,
      max,
      transactionId,
    }) => {
      const { data: mutationData, errors } = await graphql.mutation({
        query: incrementDocumentAttribute,
        variables: {
          databaseId,
          collectionId,
          documentId,
          attribute,
          value,
          max,
          transactionId,
        },
      })

      if (errors) {
        throw errors
      }

      return mutationData.databasesIncrementDocumentAttribute
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

      queryClient.setQueryData<IncrementAttributeVariables>(documentKeyPrefix, (old) => {
        if (!old) return old
        const current = (old[variables.attribute] as number) ?? 0
        const increment = variables.value ?? 1
        const newValue =
          variables.max != null ? Math.min(current + increment, variables.max) : current + increment

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
