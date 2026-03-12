import type { ResultOf, VariablesOf } from 'gql.tada'
import { graphql as gql } from 'gql.tada'

import { Keys } from '../query/Keys'
import type { AppwriteException, QueryOptions } from '../types'
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

type Variables = VariablesOf<typeof getTransaction>
type Result = ResultOf<typeof getTransaction>['databasesGetTransaction']

export function useGetTransaction({ transactionId }: Variables, opts: QueryOptions = {}) {
  const { graphql } = useAppwrite()

  const queryResult = useQuery<Result, AppwriteException[], Result>({
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

  return { ...queryResult }
}
