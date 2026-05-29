import type { ResultOf, VariablesOf } from 'gql.tada'
import { graphql as gql } from 'gql.tada'

import { Keys } from '../query/Keys'
import type { AppwriteException, Prettify } from '../types'
import { useAppwrite } from '../useAppwrite'
import { useMutation } from '../useMutation'
import { useQueryClient } from '../useQueryClient'

export const decrementRowColumn = gql(/* GraphQL */ `
  mutation DecrementRowColumn(
    $databaseId: String!
    $tableId: String!
    $rowId: String!
    $column: String!
    $value: Int
    $min: Int
    $transactionId: String
  ) {
    tablesDBDecrementRowColumn(
      databaseId: $databaseId
      tableId: $tableId
      rowId: $rowId
      column: $column
      value: $value
      min: $min
      transactionId: $transactionId
    ) {
      _id
      data
    }
  }
`)

/** The variables accepted by the {@link useDecrementRowColumn} mutation. */
export type DecrementRowColumnVariables = Prettify<VariablesOf<typeof decrementRowColumn>>

/** The result returned by the {@link useDecrementRowColumn} mutation. */
export type DecrementRowColumnResult = Prettify<
  ResultOf<typeof decrementRowColumn>['tablesDBDecrementRowColumn']
>

/**
 * Mutation hook to atomically decrement a numeric TablesDB row column with optimistic updates.
 *
 * Accepts an optional `value` (default: 1) and `min` floor. The optimistic update
 * immediately reflects the new value in the cache and rolls back on error.
 *
 * @example
 * ```tsx
 * const { mutate } = useDecrementRowColumn()
 *
 * // Decrement "lives" by 1
 * mutate({
 *   databaseId: 'my-db',
 *   tableId: 'players',
 *   rowId: 'player-1',
 *   column: 'lives',
 * })
 *
 * // Decrement "balance" by 50, floored at 0
 * mutate({
 *   databaseId: 'my-db',
 *   tableId: 'accounts',
 *   rowId: 'acct-1',
 *   column: 'balance',
 *   value: 50,
 *   min: 0,
 * })
 * ```
 *
 * **Variables** ({@link DecrementRowColumnVariables}):
 * - `databaseId` — The target database ID
 * - `tableId` — The target table ID
 * - `rowId` — The ID of the row containing the column
 * - `column` — The name of the numeric column to decrement
 * - `value` — Optional decrement amount (defaults to `1`)
 * - `min` — Optional minimum floor; the column value will not go below this value
 * - `transactionId` — Optional transaction ID for atomic operations
 *
 * @returns A `UseMutationResult` with the row's `_id` and updated `data`.
 */
export function useDecrementRowColumn() {
  const { graphql } = useAppwrite()
  const queryClient = useQueryClient()

  const mutationResult = useMutation<
    DecrementRowColumnResult,
    AppwriteException[],
    DecrementRowColumnVariables,
    {
      previousEntries: [queryKey: readonly unknown[], data: unknown][]
      rowKeyPrefix: readonly unknown[]
    }
  >({
    mutationKey: [...Keys.tablesDB('').table('').rows().key(), 'decrementColumn'],
    mutationFn: async ({ databaseId, tableId, rowId, column, value, min, transactionId }) => {
      const { data: mutationData, errors } = await graphql.mutation({
        query: decrementRowColumn,
        variables: {
          databaseId,
          tableId,
          rowId,
          column,
          value,
          min,
          transactionId,
        },
      })

      if (errors) {
        throw errors
      }

      return mutationData.tablesDBDecrementRowColumn
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

      queryClient.setQueryData<DecrementRowColumnVariables>(rowKeyPrefix, (old) => {
        if (!old) return old
        const current =
          ((old as unknown as Record<string, unknown>)[variables.column] as number) ?? 0
        const decrement = variables.value ?? 1
        const newValue =
          variables.min != null ? Math.max(current - decrement, variables.min) : current - decrement

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
