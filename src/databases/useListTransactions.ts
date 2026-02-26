import { AppwriteException } from '../types'

import { gql } from '../__generated__'
import { ListTransactionsQuery } from '../__generated__/graphql'
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

export function useListTransactions({ queries }: { queries?: string } = {}) {
  const { graphql } = useAppwrite()

  const queryResult = useQuery<
    ListTransactionsQuery['databasesListTransactions'],
    AppwriteException[],
    ListTransactionsQuery['databasesListTransactions']
  >({
    queryKey: ['appwrite', 'databases', 'transactions', { queries }],
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
  })

  return { ...queryResult }
}
