import type { ResultOf } from 'gql.tada'
import { graphql as gql } from 'gql.tada'

import { Keys } from '../query/Keys'
import type { AppwriteException, Prettify } from '../types'
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

/** The result returned by the {@link useLocaleCountries} hook. */
export type LocaleCountriesResult = Prettify<ResultOf<typeof listCountries>['localeListCountries']>

/**
 * Fetches the list of countries with their names and codes.
 *
 * @example
 * ```tsx
 * const { data, isLoading } = useLocaleCountries()
 *
 * // data.countries — array of { name, code }
 * ```
 *
 * @returns A `UseQueryResult` with the list of countries ({@link LocaleCountriesResult}).
 */
export function useLocaleCountries() {
  const { graphql } = useAppwrite()

  const queryResult = useQuery<LocaleCountriesResult, AppwriteException[], LocaleCountriesResult>({
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

  return queryResult
}
