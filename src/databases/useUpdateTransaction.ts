import type { ResultOf, VariablesOf } from 'gql.tada'
import { graphql as gql } from 'gql.tada'

import { Keys } from '../query/Keys'
import type { AppwriteException, Prettify } from '../types'
import { useAppwrite } from '../useAppwrite'
import { useMutation } from '../useMutation'
import { useQueryClient } from '../useQueryClient'

const updateTransaction = gql(/* GraphQL */ `
  mutation UpdateTransaction($transactionId: String!, $commit: Boolean, $rollback: Boolean) {
    databasesUpdateTransaction(
      transactionId: $transactionId
      commit: $commit
      rollback: $rollback
    ) {
      _id
      status
      operations
    }
  }
`)

/** The variables accepted by the {@link useUpdateTransaction} mutation. */
export type UpdateTransactionVariables = Prettify<VariablesOf<typeof updateTransaction>>

/** The result returned by the {@link useUpdateTransaction} mutation. */
export type UpdateTransactionResult = Prettify<
  ResultOf<typeof updateTransaction>['databasesUpdateTransaction']
>

/**
 * Mutation hook to commit or rollback a transaction.
 *
 * Invalidates both the individual transaction query and the transaction list queries
 * on success.
 *
 * @example
 * ```tsx
 * const { mutate } = useUpdateTransaction()
 *
 * // Commit a transaction
 * mutate({ transactionId: 'txn-abc', commit: true })
 *
 * // Or roll it back
 * mutate({ transactionId: 'txn-abc', rollback: true })
 * ```
 *
 * **Variables** ({@link UpdateTransactionVariables}):
 * - `transactionId` — The ID of the transaction to update
 * - `commit` — Optional boolean; set to `true` to commit the transaction
 * - `rollback` — Optional boolean; set to `true` to rollback the transaction
 *
 * @returns A `UseMutationResult` with the transaction's `_id`, `status`, and `operations` list.
 */
export function useUpdateTransaction() {
  const { graphql } = useAppwrite()
  const queryClient = useQueryClient()

  const mutationResult = useMutation<
    UpdateTransactionResult,
    AppwriteException[],
    UpdateTransactionVariables
  >({
    mutationKey: Keys.databases().transactions().update(),
    mutationFn: async ({ transactionId, commit, rollback }) => {
      const { data, errors } = await graphql.mutation({
        query: updateTransaction,
        variables: { transactionId, commit, rollback },
      })

      if (errors) {
        throw errors
      }

      return data.databasesUpdateTransaction
    },
    onSuccess: (_, variables) => {
      void queryClient.invalidateQueries({
        queryKey: Keys.databases().transaction(variables.transactionId).key(),
      })
      void queryClient.invalidateQueries({
        queryKey: Keys.databases().transactions().key(),
      })
    },
  })

  return mutationResult
}
