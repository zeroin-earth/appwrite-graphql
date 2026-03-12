import type { ResultOf } from 'gql.tada'
import { graphql as gql } from 'gql.tada'

import { Keys } from '../query/Keys'
import type { AppwriteException, QueryOptions } from '../types'
import { useAppwrite } from '../useAppwrite'
import { useQuery } from '../useQuery'

const accountListIdentities = gql(/* GraphQL */ `
  query ListIdentities {
    accountListIdentities {
      total
      identities {
        _id
        userId
        provider
      }
    }
  }
`)

type Result = ResultOf<typeof accountListIdentities>['accountListIdentities']

export function useListIdentities(opts: QueryOptions = {}) {
  const { graphql } = useAppwrite()

  const queryResult = useQuery<Result, AppwriteException[], Result>({
    queryKey: Keys.account().identities(),
    queryFn: async () => {
      const { data, errors } = await graphql.query({
        query: accountListIdentities,
      })

      if (errors) {
        throw errors
      }

      return data.accountListIdentities
    },
    ...opts,
  })

  return { ...queryResult }
}
