import type { ResultOf } from 'gql.tada'
import { graphql as gql } from 'gql.tada'

import { Keys } from '../query/Keys'
import type { AppwriteException } from '../types'
import { useAppwrite } from '../useAppwrite'
import { useQuery } from '../useQuery'

const listContinents = gql(/* GraphQL */ `
  query ListContinents {
    localeListContinents {
      total
      continents {
        name
        code
      }
    }
  }
`)

type Result = ResultOf<typeof listContinents>['localeListContinents']

export function useLocaleContinents() {
  const { graphql } = useAppwrite()

  const queryResult = useQuery<Result, AppwriteException[], Result>({
    queryKey: Keys.locale().continents(),
    queryFn: async () => {
      const { data, errors } = await graphql.query({
        query: listContinents,
      })

      if (errors) {
        throw errors
      }

      return data.localeListContinents
    },
  })

  return { ...queryResult }
}
