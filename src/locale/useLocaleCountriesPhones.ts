import type { ResultOf } from 'gql.tada'
import { graphql as gql } from 'gql.tada'

import { Keys } from '../query/Keys'
import type { AppwriteException } from '../types'
import { useAppwrite } from '../useAppwrite'
import { useQuery } from '../useQuery'

const listCountriesPhones = gql(/* GraphQL */ `
  query ListCountriesPhones {
    localeListCountriesPhones {
      total
      phones {
        code
        countryCode
        countryName
      }
    }
  }
`)

type Result = ResultOf<typeof listCountriesPhones>['localeListCountriesPhones']

export function useLocaleCountriesPhones() {
  const { graphql } = useAppwrite()

  const queryResult = useQuery<Result, AppwriteException[], Result>({
    queryKey: Keys.locale().countriesPhones(),
    queryFn: async () => {
      const { data, errors } = await graphql.query({
        query: listCountriesPhones,
      })

      if (errors) {
        throw errors
      }

      return data.localeListCountriesPhones
    },
  })

  return { ...queryResult }
}
