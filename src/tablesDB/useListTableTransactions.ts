import type { ResultOf } from 'gql.tada'
import { graphql as gql } from 'gql.tada'

import { Keys } from '../query/Keys'
import type { AppwriteException, Prettify, QueryOptions } from '../types'
import { useAppwrite } from '../useAppwrite'
import { useQuery } from '../useQuery'

const listTableTransactions = gql(/* GraphQL */ `
  query ListTableTransactions($queries: String) {
    tablesDBListTransactions(queries: $queries) {
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

/** The result returned by the {@link useListTableTransactions} hook. */
export type ListTableTransactionsResult = Prettify<
  ResultOf<typeof listTableTransactions>['tablesDBListTransactions']
>

/**
 * Fetches a list of TablesDB transactions with optional query filters.
 *
 * @example
 * ```tsx
 * const { data, isLoading } = useListTableTransactions()
 * ```
 *
 * **Parameters:**
 * - `queries` — Optional query string to filter transactions
 *
 * @returns A `UseQueryResult` with the transaction list as {@link ListTableTransactionsResult},
 *   containing `total` and `transactions`.
 */
export function useListTableTransactions(
  { queries }: { queries?: string } = {},
  opts: QueryOptions = {},
) {
  const { graphql } = useAppwrite()

  const queryResult = useQuery<
    ListTableTransactionsResult,
    AppwriteException[],
    ListTableTransactionsResult
  >({
    queryKey: [...Keys.tablesDBs().tableTransactions().key(), ...(queries ? [queries] : [])],
    queryFn: async () => {
      const { data, errors } = await graphql.query({
        query: listTableTransactions,
        variables: { queries },
      })

      if (errors) {
        throw errors
      }

      return data.tablesDBListTransactions
    },
    ...opts,
  })

  return queryResult
}
