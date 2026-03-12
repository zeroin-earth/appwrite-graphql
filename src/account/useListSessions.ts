import type { ResultOf } from 'gql.tada'
import { graphql as gql } from 'gql.tada'

import { Keys } from '../query/Keys'
import type { AppwriteException, QueryOptions } from '../types'
import { useAppwrite } from '../useAppwrite'
import { useQuery } from '../useQuery'

const accountListSessions = gql(/* GraphQL */ `
  query ListSessions {
    accountListSessions {
      sessions {
        _id
        _createdAt
        osName
        clientName
      }
    }
  }
`)

type Result = ResultOf<typeof accountListSessions>['accountListSessions']

export function useListSessions(opts: QueryOptions = {}) {
  const { graphql } = useAppwrite()

  const queryResult = useQuery<Result, AppwriteException[], Result>({
    queryKey: Keys.account().sessions(),
    queryFn: async () => {
      const { data, errors } = await graphql.query({
        query: accountListSessions,
      })

      if (errors) {
        throw errors
      }

      return data.accountListSessions
    },
    ...opts,
  })

  return { ...queryResult }
}
