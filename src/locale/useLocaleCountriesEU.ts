import type { ResultOf } from 'gql.tada'
import { graphql as gql } from 'gql.tada'

import { Keys } from '../query/Keys'
import type { AppwriteException, Prettify } from '../types'
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

/** The result returned by the {@link useLocaleCountriesEU} hook. */
export type LocaleCountriesEUResult = Prettify<
  ResultOf<typeof listCountriesEU>['localeListCountriesEU']
>

/**
 * Fetches the list of EU member countries.
 *
 * @example
 * ```tsx
 * const { data, isLoading } = useLocaleCountriesEU()
 *
 * // data.countries — array of { name, code }
 * ```
 *
 * @returns A `UseQueryResult` with the list of EU countries ({@link LocaleCountriesEUResult}).
 */
export function useLocaleCountriesEU() {
  const { graphql } = useAppwrite()

  const queryResult = useQuery<
    LocaleCountriesEUResult,
    AppwriteException[],
    LocaleCountriesEUResult
  >({
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

  return queryResult
}
