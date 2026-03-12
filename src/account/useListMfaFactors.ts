import type { ResultOf } from 'gql.tada'
import { graphql as gql } from 'gql.tada'

import { Keys } from '../query/Keys'
import type { AppwriteException, QueryOptions } from '../types'
import { useAppwrite } from '../useAppwrite'
import { useQuery } from '../useQuery'

const listMFAFactors = gql(/* GraphQL */ `
  query ListMfaFactors {
    accountListMfaFactors {
      totp
      phone
      email
    }
  }
`)

type Result = ResultOf<typeof listMFAFactors>['accountListMfaFactors']

export function useListMfaFactors(opts: QueryOptions = {}) {
  const { graphql } = useAppwrite()

  const queryResult = useQuery<Result, AppwriteException[], Result>({
    queryKey: Keys.account().mfaFactors(),
    queryFn: async () => {
      const { data, errors } = await graphql.query({
        query: listMFAFactors,
      })

      if (errors) {
        throw errors
      }

      return data.accountListMfaFactors
    },
    ...opts,
  })

  return { ...queryResult }
}
