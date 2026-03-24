import type { ResultOf, VariablesOf } from 'gql.tada'
import { graphql as gql } from 'gql.tada'

import { Keys } from '../query/Keys'
import type { AppwriteException, Prettify } from '../types'
import { useAppwrite } from '../useAppwrite'
import { useMutation } from '../useMutation'
import { useQueryClient } from '../useQueryClient'

const createTransaction = gql(/* GraphQL */ `
  mutation CreateTransaction($ttl: Int) {
    databasesCreateTransaction(ttl: $ttl) {
      _id
      status
      operations
      expiresAt
    }
  }
`)

/** The variables accepted by the {@link useCreateTransaction} mutation. */
export type CreateTransactionVariables = Prettify<VariablesOf<typeof createTransaction>>

/** The result returned by the {@link useCreateTransaction} mutation. */
export type CreateTransactionResult = Prettify<
  ResultOf<typeof createTransaction>['databasesCreateTransaction']
>

/**
 * Mutation hook to create a new database transaction with optional TTL.
 *
 * Invalidates transaction list queries on success.
 *
 * @example
 * ```tsx
 * const { mutate, data } = useCreateTransaction()
 *
 * // Create a transaction with a 60-second TTL
 * mutate({ ttl: 60 })
 *
 * // Or create one with the default TTL
 * mutate({})
 * ```
 *
 * **Variables** ({@link CreateTransactionVariables}):
 * - `ttl` — Optional time-to-live in seconds for the transaction before it auto-expires
 *
 * @returns A `UseMutationResult` with the transaction's `_id`, `status`, `operations` list, and `expiresAt` timestamp.
 */
export function useCreateTransaction() {
  const { graphql } = useAppwrite()
  const queryClient = useQueryClient()

  const mutationResult = useMutation<
    CreateTransactionResult,
    AppwriteException[],
    CreateTransactionVariables
  >({
    mutationKey: Keys.databases().transactions().create(),
    mutationFn: async ({ ttl } = {}) => {
      const { data, errors } = await graphql.mutation({
        query: createTransaction,
        variables: { ttl },
      })

      if (errors) {
        throw errors
      }

      return data.databasesCreateTransaction
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: Keys.databases().transactions().key(),
      })
    },
  })

  return mutationResult
}
