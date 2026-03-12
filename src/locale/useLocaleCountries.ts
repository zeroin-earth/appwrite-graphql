import type { ResultOf } from 'gql.tada'
import { graphql as gql } from 'gql.tada'

import { Keys } from '../query/Keys'
import type { AppwriteException } from '../types'
import { useAppwrite } from '../useAppwrite'
import { useQuery } from '../useQuery'

const listCountries = gql(/* GraphQL */ `
  query ListCountries {
    localeListCountries {
      total
      countries {
        name
        code
      }
    }
  }
`)

type Result = ResultOf<typeof listCountries>['localeListCountries']

export function useLocaleCountries() {
  const { graphql } = useAppwrite()

  const queryResult = useQuery<Result, AppwriteException[], Result>({
    queryKey: Keys.locale().countries(),
    queryFn: async () => {
      const { data, errors } = await graphql.query({
        query: listCountries,
      })

      if (errors) {
        throw errors
      }

      return data.localeListCountries
    },
  })

  return { ...queryResult }
}
