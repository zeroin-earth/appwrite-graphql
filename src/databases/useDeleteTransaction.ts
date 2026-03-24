import type { ResultOf, VariablesOf } from 'gql.tada'
import { graphql as gql } from 'gql.tada'

import { Keys } from '../query/Keys'
import type { AppwriteException, Prettify } from '../types'
import { useAppwrite } from '../useAppwrite'
import { useMutation } from '../useMutation'
import { useQueryClient } from '../useQueryClient'

const deleteTransaction = gql(/* GraphQL */ `
  mutation DeleteTransaction($transactionId: String!) {
    databasesDeleteTransaction(transactionId: $transactionId) {
      status
    }
  }
`)

/** The variables accepted by the {@link useDeleteTransaction} mutation. */
export type DeleteTransactionVariables = Prettify<VariablesOf<typeof deleteTransaction>>

/** The result returned by the {@link useDeleteTransaction} mutation. */
export type DeleteTransactionResult = Prettify<
  ResultOf<typeof deleteTransaction>['databasesDeleteTransaction']
>

/**
 * Mutation hook to delete a transaction by its ID.
 *
 * Removes the transaction from cache and invalidates transaction list queries on success.
 *
 * @example
 * ```tsx
 * const { mutate, isPending } = useDeleteTransaction()
 *
 * mutate({ transactionId: 'txn-abc' })
 * ```
 *
 * **Variables** ({@link DeleteTransactionVariables}):
 * - `transactionId` — The ID of the transaction to delete
 *
 * @returns A `UseMutationResult` with a `status` string indicating the deletion result.
 */
export function useDeleteTransaction() {
  const { graphql } = useAppwrite()
  const queryClient = useQueryClient()

  const mutationResult = useMutation<
    DeleteTransactionResult,
    AppwriteException[],
    DeleteTransactionVariables
  >({
    mutationKey: Keys.databases().transactions().delete(),
    mutationFn: async ({ transactionId }) => {
      const { data, errors } = await graphql.mutation({
        query: deleteTransaction,
        variables: { transactionId },
      })

      if (errors) {
        throw errors
      }

      return data?.databasesDeleteTransaction ?? { status: '' }
    },
    onSuccess: (_, variables) => {
      queryClient.removeQueries({
        queryKey: Keys.databases().transaction(variables.transactionId).key(),
      })
      void queryClient.invalidateQueries({
        queryKey: Keys.databases().transactions().key(),
      })
    },
  })

  return mutationResult
}
