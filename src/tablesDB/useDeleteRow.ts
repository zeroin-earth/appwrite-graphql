import type { ResultOf, VariablesOf } from 'gql.tada'
import { graphql as gql } from 'gql.tada'

import { Keys } from '../query/Keys'
import type { AppwriteException, Prettify } from '../types'
import { useAppwrite } from '../useAppwrite'
import { useMutation } from '../useMutation'
import { useQueryClient } from '../useQueryClient'

export const deleteRow = gql(/* GraphQL */ `
  mutation DeleteRow(
    $databaseId: String!
    $tableId: String!
    $rowId: String!
    $transactionId: String
  ) {
    tablesDBDeleteRow(
      databaseId: $databaseId
      tableId: $tableId
      rowId: $rowId
      transactionId: $transactionId
    ) {
      status
    }
  }
`)

/** The variables accepted by the {@link useDeleteRow} mutation. */
export type DeleteRowVariables = Prettify<VariablesOf<typeof deleteRow>>

/** The result returned by the {@link useDeleteRow} mutation. */
export type DeleteRowResult = Prettify<ResultOf<typeof deleteRow>['tablesDBDeleteRow']>

/**
 * Mutation hook to delete a TablesDB row with optimistic removal.
 *
 * Removes the row from cache immediately and rolls back on error.
 * On settlement, the row queries are removed and the parent table's
 * row list queries are invalidated.
 *
 * @example
 * ```tsx
 * const { mutate, isPending } = useDeleteRow()
 *
 * mutate({
 *   databaseId: 'my-db',
 *   tableId: 'my-table',
 *   rowId: 'row-123',
 * })
 * ```
 *
 * **Variables** ({@link DeleteRowVariables}):
 * - `databaseId` — The target database ID
 * - `tableId` — The target table ID
 * - `rowId` — The ID of the row to delete
 * - `transactionId` — Optional transaction ID for atomic operations
 *
 * @returns A `UseMutationResult` with a `status` string indicating the deletion result.
 */
export function useDeleteRow() {
  const { graphql } = useAppwrite()
  const queryClient = useQueryClient()

  const mutationResult = useMutation<
    DeleteRowResult,
    AppwriteException[],
    DeleteRowVariables,
    {
      previousEntries: [queryKey: readonly unknown[], data: unknown][]
      rowKeyPrefix: readonly unknown[]
    }
  >({
    mutationKey: Keys.tablesDB('').table('').rows().delete(),
    mutationFn: async ({ databaseId, tableId, rowId, transactionId }) => {
      const { data: mutationData, errors } = await graphql.mutation({
        query: deleteRow,
        variables: {
          databaseId,
          tableId,
          rowId,
          transactionId,
        },
      })

      if (errors) {
        throw errors
      }

      return mutationData?.tablesDBDeleteRow ?? { status: '' }
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

      queryClient.removeQueries({ queryKey: rowKeyPrefix })

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
      queryClient.removeQueries({
        queryKey: Keys.tablesDB(variables.databaseId)
          .table(variables.tableId)
          .row(variables.rowId)
          .key(),
      })
      void queryClient.invalidateQueries({
        queryKey: Keys.tablesDB(variables.databaseId).table(variables.tableId).rows().key(),
      })
    },
  })

  return mutationResult
}
