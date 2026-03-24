import type { ResultOf } from 'gql.tada'
import { graphql as gql } from 'gql.tada'

import { Keys } from '../query/Keys'
import type { AppwriteException, Prettify, QueryOptions } from '../types'
import { useAppwrite } from '../useAppwrite'
import { useQuery } from '../useQuery'

const listTransactions = gql(/* GraphQL */ `
  query ListTransactions($queries: String) {
    databasesListTransactions(queries: $queries) {
      total
      transactions {
        _id
        _createdAt
        _updatedAt
        status
        operations
        expiresAt
      }
    }
  }
`)

/** The result returned by the {@link useListTransactions} hook. */
export type ListTransactionsResult = Prettify<
  ResultOf<typeof listTransactions>['databasesListTransactions']
>

/**
 * Fetches a list of database transactions with optional query filters.
 *
 * @example
 * ```tsx
 * const { data, isLoading } = useListTransactions()
 * ```
 *
 * **Parameters:**
 * - `queries` — Optional query string to filter transactions
 *
 * @returns A `UseQueryResult` with the transaction list as {@link ListTransactionsResult},
 *   containing `total` and `transactions`.
 */
export function useListTransactions(
  { queries }: { queries?: string } = {},
  opts: QueryOptions = {},
) {
  const { graphql } = useAppwrite()

  const queryResult = useQuery<ListTransactionsResult, AppwriteException[], ListTransactionsResult>(
    {
      queryKey: [...Keys.databases().transactions().key(), ...(queries ? [queries] : [])],
      queryFn: async () => {
        const { data, errors } = await graphql.query({
          query: listTransactions,
          variables: { queries },
        })

        if (errors) {
          throw errors
        }

        return data.databasesListTransactions
      },
      ...opts,
    },
  )

  return queryResult
}
