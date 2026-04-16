import type { ResultOf, VariablesOf } from 'gql.tada'
import { graphql as gql } from 'gql.tada'

import { Keys } from '../query/Keys'
import type { AppwriteException, Prettify } from '../types'
import { useAppwrite } from '../useAppwrite'
import { useMutation } from '../useMutation'
import { useQueryClient } from '../useQueryClient'

const deleteTableTransaction = gql(/* GraphQL */ `
  mutation DeleteTableTransaction($transactionId: String!) {
    tablesDBDeleteTransaction(transactionId: $transactionId) {
      status
    }
  }
`)

/** The variables accepted by the {@link useDeleteTableTransaction} mutation. */
export type DeleteTableTransactionVariables = Prettify<VariablesOf<typeof deleteTableTransaction>>

/** The result returned by the {@link useDeleteTableTransaction} mutation. */
export type DeleteTableTransactionResult = Prettify<
  ResultOf<typeof deleteTableTransaction>['tablesDBDeleteTransaction']
>

/**
 * Mutation hook to delete a TablesDB transaction by its ID.
 *
 * Removes the transaction from cache and invalidates transaction list queries on success.
 *
 * @example
 * ```tsx
 * const { mutate, isPending } = useDeleteTableTransaction()
 *
 * mutate({ transactionId: 'txn-abc' })
 * ```
 *
 * **Variables** ({@link DeleteTableTransactionVariables}):
 * - `transactionId` — The ID of the transaction to delete
 *
 * @returns A `UseMutationResult` with a `status` string indicating the deletion result.
 */
export function useDeleteTableTransaction() {
  const { graphql } = useAppwrite()
  const queryClient = useQueryClient()

  const mutationResult = useMutation<
    DeleteTableTransactionResult,
    AppwriteException[],
    DeleteTableTransactionVariables
  >({
    mutationKey: Keys.tablesDBs().tableTransactions().delete(),
    mutationFn: async ({ transactionId }) => {
      const { data, errors } = await graphql.mutation({
        query: deleteTableTransaction,
        variables: { transactionId },
      })

      if (errors) {
        throw errors
      }

      return data?.tablesDBDeleteTransaction ?? { status: '' }
    },
    onSuccess: (_, variables) => {
      queryClient.removeQueries({
        queryKey: Keys.tablesDBs().tableTransaction(variables.transactionId).key(),
      })
      void queryClient.invalidateQueries({
        queryKey: Keys.tablesDBs().tableTransactions().key(),
      })
    },
  })

  return mutationResult
}
