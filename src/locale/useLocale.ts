import type { ResultOf } from 'gql.tada'
import { graphql as gql } from 'gql.tada'

import { Keys } from '../query/Keys'
import type { AppwriteException, Prettify } from '../types'
import { useAppwrite } from '../useAppwrite'
import { useQuery } from '../useQuery'

const getLocale = gql(/* GraphQL */ `
  query GetLocale {
    localeGet {
      ip
      countryCode
      country
      continentCode
      continent
      eu
      currency
    }
  }
`)

/** The result returned by the {@link useLocale} hook. */
export type LocaleResult = Prettify<ResultOf<typeof getLocale>['localeGet']>

/**
 * Fetches the current user's locale information including IP, country,
 * continent, EU status, and currency.
 *
 * @example
 * ```tsx
 * const { data, isLoading } = useLocale()
 *
 * // data.country, data.ip, data.currency, etc.
 * ```
 *
 * @returns A `UseQueryResult` with the user's locale details ({@link LocaleResult}).
 */
export function useLocale() {
  const { graphql } = useAppwrite()

  const queryResult = useQuery<LocaleResult, AppwriteException[], LocaleResult>({
    queryKey: Keys.locale().key(),
    queryFn: async () => {
      const { data, errors } = await graphql.query({
        query: getLocale,
      })

      if (errors) {
        throw errors
      }

      return data.localeGet
    },
  })

  return queryResult
}
