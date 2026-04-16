import type { ResultOf, VariablesOf } from 'gql.tada'
import { graphql as gql } from 'gql.tada'

import { Keys } from '../query/Keys'
import type { AppwriteException, Prettify } from '../types'
import { useAppwrite } from '../useAppwrite'
import { useMutation } from '../useMutation'
import { useQueryClient } from '../useQueryClient'

const createTableTransaction = gql(/* GraphQL */ `
  mutation CreateTableTransaction($ttl: Int) {
    tablesDBCreateTransaction(ttl: $ttl) {
      _id
      status
      operations
      expiresAt
    }
  }
`)

/** The variables accepted by the {@link useCreateTableTransaction} mutation. */
export type CreateTableTransactionVariables = Prettify<VariablesOf<typeof createTableTransaction>>

/** The result returned by the {@link useCreateTableTransaction} mutation. */
export type CreateTableTransactionResult = Prettify<
  ResultOf<typeof createTableTransaction>['tablesDBCreateTransaction']
>

/**
 * Mutation hook to create a new TablesDB transaction with optional TTL.
 *
 * Invalidates transaction list queries on success.
 *
 * @example
 * ```tsx
 * const { mutate, data } = useCreateTableTransaction()
 *
 * // Create a transaction with a 60-second TTL
 * mutate({ ttl: 60 })
 *
 * // Or create one with the default TTL
 * mutate({})
 * ```
 *
 * **Variables** ({@link CreateTableTransactionVariables}):
 * - `ttl` — Optional time-to-live in seconds for the transaction before it auto-expires
 *
 * @returns A `UseMutationResult` with the transaction's `_id`, `status`, `operations` list, and `expiresAt` timestamp.
 */
export function useCreateTableTransaction() {
  const { graphql } = useAppwrite()
  const queryClient = useQueryClient()

  const mutationResult = useMutation<
    CreateTableTransactionResult,
    AppwriteException[],
    CreateTableTransactionVariables
  >({
    mutationKey: Keys.tablesDBs().tableTransactions().create(),
    mutationFn: async ({ ttl } = {}) => {
      const { data, errors } = await graphql.mutation({
        query: createTableTransaction,
        variables: { ttl },
      })

      if (errors) {
        throw errors
      }

      return data.tablesDBCreateTransaction
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: Keys.tablesDBs().tableTransactions().key(),
      })
    },
  })

  return mutationResult
}
