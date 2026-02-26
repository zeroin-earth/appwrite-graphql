import { AppwriteException } from '../types'

import { gql } from '../__generated__'
import { GetTransactionQuery, GetTransactionQueryVariables } from '../__generated__/graphql'
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

export function useGetTransaction({ transactionId }: GetTransactionQueryVariables) {
  const { graphql } = useAppwrite()

  const queryResult = useQuery<
    GetTransactionQuery['databasesGetTransaction'],
    AppwriteException[],
    GetTransactionQuery['databasesGetTransaction']
  >({
    queryKey: ['appwrite', 'databases', 'transactions', transactionId],
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
  })

  return { ...queryResult }
}
