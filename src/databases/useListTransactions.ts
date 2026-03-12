import type { ResultOf } from 'gql.tada'
import { graphql as gql } from 'gql.tada'

import { Keys } from '../query/Keys'
import type { AppwriteException, QueryOptions } from '../types'
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

type Result = ResultOf<typeof listTransactions>['databasesListTransactions']

export function useListTransactions(
  { queries }: { queries?: string } = {},
  opts: QueryOptions = {},
) {
  const { graphql } = useAppwrite()

  const queryResult = useQuery<Result, AppwriteException[], Result>({
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
  })

  return { ...queryResult }
}
