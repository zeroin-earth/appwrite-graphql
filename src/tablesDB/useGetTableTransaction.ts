import type { ResultOf, VariablesOf } from 'gql.tada'
import { graphql as gql } from 'gql.tada'

import { Keys } from '../query/Keys'
import type { AppwriteException, Prettify, QueryOptions } from '../types'
import { useAppwrite } from '../useAppwrite'
import { useQuery } from '../useQuery'

const getTableTransaction = gql(/* GraphQL */ `
  query GetTableTransaction($transactionId: String!) {
    tablesDBGetTransaction(transactionId: $transactionId) {
      _id
      _createdAt
      _updatedAt
      status
      operations
      expiresAt
    }
  }
`)

/** The variables accepted by the {@link useGetTableTransaction} hook. */
export type GetTableTransactionVariables = Prettify<VariablesOf<typeof getTableTransaction>>

/** The result returned by the {@link useGetTableTransaction} hook. */
export type GetTableTransactionResult = Prettify<
  ResultOf<typeof getTableTransaction>['tablesDBGetTransaction']
>

/**
 * Fetches a TablesDB transaction by its ID, including status, operations, and expiry.
 *
 * @example
 * ```tsx
 * const { data, isLoading } = useGetTableTransaction({
 *   transactionId: 'txn-abc-123',
 * })
 * ```
 *
 * **Parameters** ({@link GetTableTransactionVariables}):
 * - `transactionId` — The ID of the transaction to fetch
 *
 * @returns A `UseQueryResult` with the transaction data as {@link GetTableTransactionResult}.
 */
export function useGetTableTransaction(
  { transactionId }: GetTableTransactionVariables,
  opts: QueryOptions = {},
) {
  const { graphql } = useAppwrite()

  const queryResult = useQuery<
    GetTableTransactionResult,
    AppwriteException[],
    GetTableTransactionResult
  >({
    queryKey: Keys.tablesDBs().tableTransaction(transactionId).key(),
    queryFn: async () => {
      const { data, errors } = await graphql.query({
        query: getTableTransaction,
        variables: { transactionId },
      })

      if (errors) {
        throw errors
      }

      return data.tablesDBGetTransaction
    },
    ...opts,
  })

  return queryResult
}
