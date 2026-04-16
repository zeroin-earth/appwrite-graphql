import type { ResultOf, VariablesOf } from 'gql.tada'
import { graphql as gql } from 'gql.tada'

import { Keys } from '../query/Keys'
import type { AppwriteException, Prettify } from '../types'
import { useAppwrite } from '../useAppwrite'
import { useMutation } from '../useMutation'
import { useQueryClient } from '../useQueryClient'

const createTableOperations = gql(/* GraphQL */ `
  mutation CreateTableOperations($transactionId: String!, $operations: [String]) {
    tablesDBCreateOperations(transactionId: $transactionId, operations: $operations) {
      _id
      status
      operations
      expiresAt
    }
  }
`)

/** The variables accepted by the {@link useCreateTableOperations} mutation. */
export type CreateTableOperationsVariables = Prettify<VariablesOf<typeof createTableOperations>>

/** The result returned by the {@link useCreateTableOperations} mutation. */
export type CreateTableOperationsResult = Prettify<
  ResultOf<typeof createTableOperations>['tablesDBCreateOperations']
>

/**
 * Mutation hook to add operations to an existing TablesDB transaction.
 *
 * Invalidates the parent transaction query on success.
 *
 * @example
 * ```tsx
 * const { mutate, isPending } = useCreateTableOperations()
 *
 * mutate({
 *   transactionId: 'txn-abc',
 *   operations: [
 *     JSON.stringify({ action: 'create', databaseId: 'my-db', tableId: 'my-tbl', rowId: 'row-1', data: '{}' }),
 *   ],
 * })
 * ```
 *
 * **Variables** ({@link CreateTableOperationsVariables}):
 * - `transactionId` — The ID of the transaction to append operations to
 * - `operations` — Optional array of JSON-encoded operation strings
 *
 * @returns A `UseMutationResult` with the transaction's `_id`, `status`, `operations` list, and `expiresAt` timestamp.
 */
export function useCreateTableOperations() {
  const { graphql } = useAppwrite()
  const queryClient = useQueryClient()

  const mutationResult = useMutation<
    CreateTableOperationsResult,
    AppwriteException[],
    CreateTableOperationsVariables
  >({
    mutationKey: Keys.tablesDBs().tableTransactions().operations().create(),
    mutationFn: async ({ transactionId, operations }) => {
      const { data, errors } = await graphql.mutation({
        query: createTableOperations,
        variables: { transactionId, operations },
      })

      if (errors) {
        throw errors
      }

      return data.tablesDBCreateOperations
    },
    onSuccess: (_, variables) => {
      void queryClient.invalidateQueries({
        queryKey: Keys.tablesDBs().tableTransaction(variables.transactionId).key(),
      })
    },
  })

  return mutationResult
}
