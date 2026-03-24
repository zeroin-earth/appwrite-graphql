import type { ResultOf, VariablesOf } from 'gql.tada'
import { graphql as gql } from 'gql.tada'

import { Keys } from '../query/Keys'
import type { AppwriteException, Prettify, QueryOptions } from '../types'
import { useAppwrite } from '../useAppwrite'
import { useQuery } from '../useQuery'

const getTransaction = gql(/* GraphQL */ `
  query GetTransaction($transactionId: String!) {
    databasesGetTransaction(transactionId: $transactionId) {
      _id
      _createdAt
      _updatedAt
      status
      operations
      expiresAt
    }
  }
`)

/** The variables accepted by the {@link useGetTransaction} hook. */
export type GetTransactionVariables = Prettify<VariablesOf<typeof getTransaction>>

/** The result returned by the {@link useGetTransaction} hook. */
export type GetTransactionResult = Prettify<
  ResultOf<typeof getTransaction>['databasesGetTransaction']
>

/**
 * Fetches a transaction by its ID, including status, operations, and expiry.
 *
 * @example
 * ```tsx
 * const { data, isLoading } = useGetTransaction({
 *   transactionId: 'txn-abc-123',
 * })
 * ```
 *
 * **Parameters** ({@link GetTransactionVariables}):
 * - `transactionId` — The ID of the transaction to fetch
 *
 * @returns A `UseQueryResult` with the transaction data as {@link GetTransactionResult}.
 */
export function useGetTransaction(
  { transactionId }: GetTransactionVariables,
  opts: QueryOptions = {},
) {
  const { graphql } = useAppwrite()

  const queryResult = useQuery<GetTransactionResult, AppwriteException[], GetTransactionResult>({
    queryKey: Keys.databases().transaction(transactionId).key(),
    queryFn: async () => {
      const { data, errors } = await graphql.query({
        query: getTransaction,
        variables: { transactionId },
      })

      if (errors) {
        throw errors
      }

      return data.databasesGetTransaction
    },
    ...opts,
  })

  return queryResult
}
