import type { ResultOf, VariablesOf } from 'gql.tada'
import { graphql as gql } from 'gql.tada'

import { Keys } from '../query/Keys'
import type { AppwriteException, Prettify } from '../types'
import { useAppwrite } from '../useAppwrite'
import { useMutation } from '../useMutation'
import { useQueryClient } from '../useQueryClient'

export const updateRow = gql(/* GraphQL */ `
  mutation UpdateRow(
    $databaseId: String!
    $tableId: String!
    $rowId: String!
    $data: Json
    $permissions: [String]
    $transactionId: String
  ) {
    tablesDBUpdateRow(
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

type Variables = VariablesOf<typeof updateRow>

/** The result returned by the {@link useUpdateRow} mutation. */
export type UpdateRowResult = Prettify<ResultOf<typeof updateRow>['tablesDBUpdateRow']>

/** The variables accepted by the {@link useUpdateRow} mutation. */
export type UpdateRowVariables = Prettify<
  Omit<Variables, 'permissions'> & {
    permissions?: string[] | null
  }
>

/** The optimistic-update context used by the {@link useUpdateRow} mutation. */
export type UpdateRowMutationContext = {
  previousEntries: [queryKey: readonly unknown[], data: unknown][]
  rowKeyPrefix: readonly unknown[]
}

/**
 * Mutation hook to update an existing TablesDB row with optimistic updates.
 *
 * Uses sparse update semantics (1.9.0 default) — only the fields provided in `data`
 * are modified; unspecified fields are left unchanged. Rolls back optimistic updates on error.
 *
 * @example
 * ```tsx
 * const { mutate, isPending } = useUpdateRow()
 *
 * mutate({
 *   databaseId: 'my-db',
 *   tableId: 'my-table',
 *   rowId: 'row-123',
 *   data: { name: 'Jane', age: 31 },
 *   permissions: ['read("any")', 'write("user:alice")'],
 * })
 * ```
 *
 * **Variables** ({@link UpdateRowVariables}):
 * - `databaseId` — The target database ID
 * - `tableId` — The target table ID
 * - `rowId` — The ID of the row to update
 * - `data` — Optional partial row data to merge (sparse update)
 * - `permissions` — Optional array of permission strings, or `null`
 * - `transactionId` — Optional transaction ID for atomic operations
 *
 * @returns A `UseMutationResult` with the updated row's `_id`.
 */
export function useUpdateRow() {
  const { graphql } = useAppwrite()
  const queryClient = useQueryClient()

  const mutationResult = useMutation<
    UpdateRowResult,
    AppwriteException[],
    UpdateRowVariables,
    UpdateRowMutationContext
  >({
    mutationKey: Keys.tablesDB('').table('').rows().update(),
    mutationFn: async ({ databaseId, tableId, rowId, data, permissions, transactionId }) => {
      const { data: mutationData, errors } = await graphql.mutation({
        query: updateRow,
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

      return mutationData.tablesDBUpdateRow
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

      queryClient.setQueryData<UpdateRowVariables>(rowKeyPrefix, (old) =>
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
