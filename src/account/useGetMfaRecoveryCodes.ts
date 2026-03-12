import type { ResultOf } from 'gql.tada'
import { graphql as gql } from 'gql.tada'

import { Keys } from '../query/Keys'
import type { AppwriteException, QueryOptions } from '../types'
import { useAppwrite } from '../useAppwrite'
import { useQuery } from '../useQuery'

const getMFARecoveryCodes = gql(/* GraphQL */ `
  query GetMfaRecoveryCodes {
    accountGetMfaRecoveryCodes {
      recoveryCodes
    }
  }
`)

type Result = ResultOf<typeof getMFARecoveryCodes>['accountGetMfaRecoveryCodes']

export function useGetMfaRecoveryCodes(opts: QueryOptions = {}) {
  const { graphql } = useAppwrite()

  const queryResult = useQuery<Result, AppwriteException[], Result>({
    queryKey: Keys.account().mfaCodes().key(),
    queryFn: async () => {
      const { data, errors } = await graphql.query({
        query: getMFARecoveryCodes,
      })

      if (errors) {
        throw errors
      }

      return data.accountGetMfaRecoveryCodes
    },
    ...opts,
  })

  return { ...queryResult }
}
