import type { ResultOf, VariablesOf } from 'gql.tada'
import { graphql as gql } from 'gql.tada'

import { Keys } from '../query/Keys'
import type { AppwriteException, Prettify } from '../types'
import { useAppwrite } from '../useAppwrite'
import { useMutation } from '../useMutation'
import { useQueryClient } from '../useQueryClient'

export const createRow = gql(/* GraphQL */ `
  mutation CreateRow(
    $databaseId: String!
    $tableId: String!
    $rowId: String!
    $data: Json!
    $permissions: [String]
    $transactionId: String
  ) {
    tablesDBCreateRow(
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

type Variables = VariablesOf<typeof createRow>

/** The result returned after creating a TablesDB row. */
export type CreateRowResult = Prettify<ResultOf<typeof createRow>['tablesDBCreateRow']>

/** The variables accepted by the {@link useCreateRow} mutation. */
export type CreateRowVariables = Prettify<
  Omit<Variables, 'permissions'> & {
    permissions?: string[] | null
  }
>

/**
 * Mutation hook to create a new TablesDB row.
 *
 * Invalidates table row list queries and sets the new row in the cache on success.
 *
 * @example
 * ```tsx
 * const { mutate, isPending } = useCreateRow()
 *
 * mutate({
 *   databaseId: 'my-db',
 *   tableId: 'my-table',
 *   rowId: ID.unique(),
 *   data: { name: 'John', age: 30 },
 *   permissions: ['read("any")'],
 * })
 * ```
 *
 * **Variables** ({@link CreateRowVariables}):
 * - `databaseId` — The target database ID
 * - `tableId` — The target table ID
 * - `rowId` — Unique row ID (use `ID.unique()` for auto-generation)
 * - `data` — The row data as a JSON-serializable object
 * - `permissions` — Optional array of permission strings, or `null`
 * - `transactionId` — Optional transaction ID for atomic operations
 *
 * @returns A `UseMutationResult` with the created row's `_id`.
 */
export function useCreateRow() {
  const { graphql } = useAppwrite()
  const queryClient = useQueryClient()

  const mutationResult = useMutation<CreateRowResult, AppwriteException[], CreateRowVariables>({
    mutationKey: Keys.tablesDB('').table('').rows().create(),
    mutationFn: async ({ databaseId, tableId, rowId, data, permissions, transactionId }) => {
      const { data: mutationData, errors } = await graphql.mutation({
        query: createRow,
        variables: {
          databaseId,
          tableId,
          rowId,
          data: JSON.stringify(data),
          permissions,
          transactionId,
        },
      })

      if (errors) {
        throw errors
      }

      return mutationData.tablesDBCreateRow
    },
    onSuccess: (result, variables) => {
      const rowKeyPrefix = Keys.tablesDB(variables.databaseId)
        .table(variables.tableId)
        .row(result!._id ?? '')
        .key()

      void queryClient.invalidateQueries({
        queryKey: Keys.tablesDB(variables.databaseId).table(variables.tableId).rows().key(),
      })

      queryClient.setQueryData<Variables>(rowKeyPrefix, {
        ...variables,
        ...(variables.data as Record<string, unknown>),
      })
    },
  })

  return mutationResult
}
