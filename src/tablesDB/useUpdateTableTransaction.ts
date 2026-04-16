import type { ResultOf, VariablesOf } from 'gql.tada'
import { graphql as gql } from 'gql.tada'

import { Keys } from '../query/Keys'
import type { AppwriteException, Prettify } from '../types'
import { useAppwrite } from '../useAppwrite'
import { useMutation } from '../useMutation'
import { useQueryClient } from '../useQueryClient'

const updateTableTransaction = gql(/* GraphQL */ `
  mutation UpdateTableTransaction($transactionId: String!, $commit: Boolean, $rollback: Boolean) {
    tablesDBUpdateTransaction(transactionId: $transactionId, commit: $commit, rollback: $rollback) {
      _id
      status
      operations
    }
  }
`)

/** The variables accepted by the {@link useUpdateTableTransaction} mutation. */
export type UpdateTableTransactionVariables = Prettify<VariablesOf<typeof updateTableTransaction>>

/** The result returned by the {@link useUpdateTableTransaction} mutation. */
export type UpdateTableTransactionResult = Prettify<
  ResultOf<typeof updateTableTransaction>['tablesDBUpdateTransaction']
>

/**
 * Mutation hook to commit or rollback a TablesDB transaction.
 *
 * Invalidates both the individual transaction query and the transaction list queries
 * on success.
 *
 * @example
 * ```tsx
 * const { mutate } = useUpdateTableTransaction()
 *
 * // Commit a transaction
 * mutate({ transactionId: 'txn-abc', commit: true })
 *
 * // Or roll it back
 * mutate({ transactionId: 'txn-abc', rollback: true })
 * ```
 *
 * **Variables** ({@link UpdateTableTransactionVariables}):
 * - `transactionId` — The ID of the transaction to update
 * - `commit` — Optional boolean; set to `true` to commit the transaction
 * - `rollback` — Optional boolean; set to `true` to rollback the transaction
 *
 * @returns A `UseMutationResult` with the transaction's `_id`, `status`, and `operations` list.
 */
export function useUpdateTableTransaction() {
  const { graphql } = useAppwrite()
  const queryClient = useQueryClient()

  const mutationResult = useMutation<
    UpdateTableTransactionResult,
    AppwriteException[],
    UpdateTableTransactionVariables
  >({
    mutationKey: Keys.tablesDBs().tableTransactions().update(),
    mutationFn: async ({ transactionId, commit, rollback }) => {
      const { data, errors } = await graphql.mutation({
        query: updateTableTransaction,
        variables: { transactionId, commit, rollback },
      })

      if (errors) {
        throw errors
      }

      return data.tablesDBUpdateTransaction
    },
    onSuccess: (_, variables) => {
      void queryClient.invalidateQueries({
        queryKey: Keys.tablesDBs().tableTransaction(variables.transactionId).key(),
      })
      void queryClient.invalidateQueries({
        queryKey: Keys.tablesDBs().tableTransactions().key(),
      })
    },
  })

  return mutationResult
}
