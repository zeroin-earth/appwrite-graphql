import type { ResultOf } from 'gql.tada'
import { graphql as gql } from 'gql.tada'

import { Keys } from '../query/Keys'
import type { AppwriteException, Prettify } from '../types'
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

/** The result returned by the {@link useLocaleCountriesPhones} hook. */
export type LocaleCountriesPhonesResult = Prettify<
  ResultOf<typeof listCountriesPhones>['localeListCountriesPhones']
>

/**
 * Fetches the list of countries with their international phone codes.
 *
 * @example
 * ```tsx
 * const { data, isLoading } = useLocaleCountriesPhones()
 *
 * // data.phones — array of { code, countryCode, countryName }
 * ```
 *
 * @returns A `UseQueryResult` with countries and phone codes ({@link LocaleCountriesPhonesResult}).
 */
export function useLocaleCountriesPhones() {
  const { graphql } = useAppwrite()

  const queryResult = useQuery<
    LocaleCountriesPhonesResult,
    AppwriteException[],
    LocaleCountriesPhonesResult
  >({
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

  return queryResult
}
