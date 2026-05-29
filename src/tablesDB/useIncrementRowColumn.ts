import type { ResultOf, VariablesOf } from 'gql.tada'
import { graphql as gql } from 'gql.tada'

import { Keys } from '../query/Keys'
import type { AppwriteException, Prettify } from '../types'
import { useAppwrite } from '../useAppwrite'
import { useMutation } from '../useMutation'
import { useQueryClient } from '../useQueryClient'

export const incrementRowColumn = gql(/* GraphQL */ `
  mutation IncrementRowColumn(
    $databaseId: String!
    $tableId: String!
    $rowId: String!
    $column: String!
    $value: Int
    $max: Int
    $transactionId: String
  ) {
    tablesDBIncrementRowColumn(
      databaseId: $databaseId
      tableId: $tableId
      rowId: $rowId
      column: $column
      value: $value
      max: $max
      transactionId: $transactionId
    ) {
      _id
      data
    }
  }
`)

/** The variables accepted by the {@link useIncrementRowColumn} mutation. */
export type IncrementRowColumnVariables = Prettify<VariablesOf<typeof incrementRowColumn>>

/** The result returned by the {@link useIncrementRowColumn} mutation. */
export type IncrementRowColumnResult = Prettify<
  ResultOf<typeof incrementRowColumn>['tablesDBIncrementRowColumn']
>

/**
 * Mutation hook to atomically increment a numeric TablesDB row column with optimistic updates.
 *
 * Accepts an optional `value` (default: 1) and `max` ceiling. The optimistic update
 * immediately reflects the new value in the cache and rolls back on error.
 *
 * @example
 * ```tsx
 * const { mutate } = useIncrementRowColumn()
 *
 * // Increment "score" by 1
 * mutate({
 *   databaseId: 'my-db',
 *   tableId: 'players',
 *   rowId: 'player-1',
 *   column: 'score',
 * })
 *
 * // Increment "lives" by 3, capped at 10
 * mutate({
 *   databaseId: 'my-db',
 *   tableId: 'players',
 *   rowId: 'player-1',
 *   column: 'lives',
 *   value: 3,
 *   max: 10,
 * })
 * ```
 *
 * **Variables** ({@link IncrementRowColumnVariables}):
 * - `databaseId` — The target database ID
 * - `tableId` — The target table ID
 * - `rowId` — The ID of the row containing the column
 * - `column` — The name of the numeric column to increment
 * - `value` — Optional increment amount (defaults to `1`)
 * - `max` — Optional maximum ceiling; the column value will not exceed this value
 * - `transactionId` — Optional transaction ID for atomic operations
 *
 * @returns A `UseMutationResult` with the row's `_id` and updated `data`.
 */
export function useIncrementRowColumn() {
  const { graphql } = useAppwrite()
  const queryClient = useQueryClient()

  const mutationResult = useMutation<
    IncrementRowColumnResult,
    AppwriteException[],
    IncrementRowColumnVariables,
    {
      previousEntries: [queryKey: readonly unknown[], data: unknown][]
      rowKeyPrefix: readonly unknown[]
    }
  >({
    mutationKey: [...Keys.tablesDB('').table('').rows().key(), 'incrementColumn'],
    mutationFn: async ({ databaseId, tableId, rowId, column, value, max, transactionId }) => {
      const { data: mutationData, errors } = await graphql.mutation({
        query: incrementRowColumn,
        variables: {
          databaseId,
          tableId,
          rowId,
          column,
          value,
          max,
          transactionId,
        },
      })

      if (errors) {
        throw errors
      }

      return mutationData.tablesDBIncrementRowColumn
    },
    onMutate: async (variables) => {
      const rowKeyPrefix = Keys.tablesDB(variables.databaseId)
        .table(variables.tableId)
        .row(variables.rowId)
        .key()

      await queryClient.cancelQueries({ queryKey: rowKeyPrefix })

      const previousEntries = queryClient.getQueriesData({
        queryKey: rowKeyPrefix,
      })

      queryClient.setQueryData<IncrementRowColumnVariables>(rowKeyPrefix, (old) => {
        if (!old) return old
        const current =
          ((old as unknown as Record<string, unknown>)[variables.column] as number) ?? 0
        const increment = variables.value ?? 1
        const newValue =
          variables.max != null ? Math.min(current + increment, variables.max) : current + increment

        return { ...old, [variables.column]: newValue }
      })

      return { previousEntries, rowKeyPrefix }
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
        queryKey: Keys.tablesDB(variables.databaseId).table(variables.tableId).rows().key(),
      })
    },
  })

  return mutationResult
}
