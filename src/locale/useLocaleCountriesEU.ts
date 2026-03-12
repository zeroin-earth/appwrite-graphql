import type { ResultOf } from 'gql.tada'
import { graphql as gql } from 'gql.tada'

import { Keys } from '../query/Keys'
import type { AppwriteException } from '../types'
import { useAppwrite } from '../useAppwrite'
import { useQuery } from '../useQuery'

const listCountriesEU = gql(/* GraphQL */ `
  query ListCountriesEU {
    localeListCountriesEU {
      total
      countries {
        name
        code
      }
    }
  }
`)

type Result = ResultOf<typeof listCountriesEU>['localeListCountriesEU']

export function useLocaleCountriesEU() {
  const { graphql } = useAppwrite()

  const queryResult = useQuery<Result, AppwriteException[], Result>({
    queryKey: Keys.locale().countriesEU(),
    queryFn: async () => {
      const { data, errors } = await graphql.query({
        query: listCountriesEU,
      })

      if (errors) {
        throw errors
      }

      return data.localeListCountriesEU
    },
  })

  return { ...queryResult }
}
