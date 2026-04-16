import type { ResultOf, VariablesOf } from 'gql.tada'
import { graphql as gql } from 'gql.tada'

import { Keys } from '../query/Keys'
import type { AppwriteException, Prettify } from '../types'
import { useAppwrite } from '../useAppwrite'
import { useMutation } from '../useMutation'
import { useQueryClient } from '../useQueryClient'

export const upsertRow = gql(/* GraphQL */ `
  mutation UpsertRow(
    $databaseId: String!
    $tableId: String!
    $rowId: String!
    $data: Json
    $permissions: [String]
    $transactionId: String
  ) {
    tablesDBUpsertRow(
      databaseId: $databaseId
      tableId: $tableId
      rowId: $rowId
      data: $data
      permissions: $permissions
      transactionId: $transactionId
    ) {
      _id
    }
  }
`)

type Variables = VariablesOf<typeof upsertRow>

/** The result returned by the {@link useUpsertRow} mutation. */
export type UpsertRowResult = Prettify<ResultOf<typeof upsertRow>['tablesDBUpsertRow']>

/** The variables accepted by the {@link useUpsertRow} mutation. */
export type UpsertRowVariables = Prettify<
  Omit<Variables, 'permissions'> & {
    permissions?: string[] | null
  }
>

/** The optimistic-update context used by the {@link useUpsertRow} mutation. */
export type UpsertRowMutationContext = {
  previousEntries: [queryKey: readonly unknown[], data: unknown][]
  rowKeyPrefix: readonly unknown[]
}

/**
 * Mutation hook to create or update a TablesDB row (upsert) with optimistic updates.
 *
 * Creates the row if it does not exist; updates it if it does. Rolls back optimistic
 * updates on error. On settlement, the table's row list queries are invalidated.
 *
 * @example
 * ```tsx
 * const { mutate, isPending } = useUpsertRow()
 *
 * mutate({
 *   databaseId: 'my-db',
 *   tableId: 'my-table',
 *   rowId: 'row-456',
 *   data: { name: 'Alice', score: 100 },
 *   permissions: ['read("any")'],
 * })
 * ```
 *
 * **Variables** ({@link UpsertRowVariables}):
 * - `databaseId` — The target database ID
 * - `tableId` — The target table ID
 * - `rowId` — Unique row ID — creates the row if it doesn't exist, updates it otherwise
 * - `data` — Optional row data to apply
 * - `permissions` — Optional array of permission strings, or `null`
 * - `transactionId` — Optional transaction ID for atomic operations
 *
 * @returns A `UseMutationResult` with the upserted row's `_id`.
 */
export function useUpsertRow() {
  const { graphql } = useAppwrite()
  const queryClient = useQueryClient()

  const mutationResult = useMutation<
    UpsertRowResult,
    AppwriteException[],
    UpsertRowVariables,
    UpsertRowMutationContext
  >({
    mutationKey: Keys.tablesDB('').table('').rows().upsert(),
    mutationFn: async ({ databaseId, tableId, rowId, data, permissions, transactionId }) => {
      const { data: mutationData, errors } = await graphql.mutation({
        query: upsertRow,
        variables: {
          databaseId,
          tableId,
          rowId,
          data: data != null ? JSON.stringify(data) : undefined,
          permissions,
          transactionId,
        },
      })

      if (errors) {
        throw errors
      }

      return mutationData.tablesDBUpsertRow
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

      queryClient.setQueryData<UpsertRowVariables>(rowKeyPrefix, (old) =>
        old ? { ...old, ...(variables.data as Record<string, unknown>) } : old,
      )

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
