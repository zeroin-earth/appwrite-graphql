import type { ResultOf } from 'gql.tada'
import { graphql as gql } from 'gql.tada'

import { Keys } from '../query/Keys'
import type { AppwriteException } from '../types'
import { useAppwrite } from '../useAppwrite'
import { useQuery } from '../useQuery'

const accountGetPrefs = gql(/* GraphQL */ `
  query GetPrefs {
    accountGetPrefs {
      data
    }
  }
`)

type Result = ResultOf<typeof accountGetPrefs>['accountGetPrefs']

export function useGetPrefs() {
  const { graphql } = useAppwrite()

  const queryResult = useQuery<Result, AppwriteException[], Result>({
    queryKey: Keys.account().prefs().key(),
    queryFn: async () => {
      const { data, errors } = await graphql.query({
        query: accountGetPrefs,
      })

      if (errors) {
        throw errors
      }

      return data.accountGetPrefs
    },
  })

  return { ...queryResult }
}
