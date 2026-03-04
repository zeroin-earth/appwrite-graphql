import type { ResultOf } from 'gql.tada'
import { graphql as gql } from 'gql.tada'

import { Keys } from '../query/Keys'
import type { AppwriteException } from '../types'
import { useAppwrite } from '../useAppwrite'
import { useQuery } from '../useQuery'

const listLocaleCodes = gql(/* GraphQL */ `
  query ListLocaleCodes {
    localeListCodes {
      total
      localeCodes {
        code
        name
      }
    }
  }
`)

type Result = ResultOf<typeof listLocaleCodes>['localeListCodes']

export function useLocaleCodes() {
  const { graphql } = useAppwrite()

  const queryResult = useQuery<Result, AppwriteException[], Result>({
    queryKey: Keys.locale().codes(),
    queryFn: async () => {
      const { data, errors } = await graphql.query({
        query: listLocaleCodes,
      })

      if (errors) {
        throw errors
      }

      return data.localeListCodes
    },
  })

  return { ...queryResult }
}
