import type { ResultOf } from 'gql.tada'
import { graphql as gql } from 'gql.tada'

import { Keys } from '../query/Keys'
import type { AppwriteException, Prettify } from '../types'
import { useAppwrite } from '../useAppwrite'
import { useQuery } from '../useQuery'

const listCurrencies = gql(/* GraphQL */ `
  query ListCurrencies {
    localeListCurrencies {
      total
      currencies {
        symbol
        name
        symbolNative
        decimalDigits
        rounding
        code
        namePlural
      }
    }
  }
`)

/** The result returned by the {@link useLocaleCurrencies} hook. */
export type LocaleCurrenciesResult = Prettify<
  ResultOf<typeof listCurrencies>['localeListCurrencies']
>

/**
 * Fetches the list of currencies with their symbols, names, and decimal info.
 *
 * @example
 * ```tsx
 * const { data, isLoading } = useLocaleCurrencies()
 *
 * // data.currencies — array of { code, name, symbol, ... }
 * ```
 *
 * @returns A `UseQueryResult` with the list of currencies ({@link LocaleCurrenciesResult}).
 */
export function useLocaleCurrencies() {
  const { graphql } = useAppwrite()

  const queryResult = useQuery<LocaleCurrenciesResult, AppwriteException[], LocaleCurrenciesResult>(
    {
      queryKey: Keys.locale().currencies(),
      queryFn: async () => {
        const { data, errors } = await graphql.query({
          query: listCurrencies,
        })

        if (errors) {
          throw errors
        }

        return data.localeListCurrencies
      },
    },
  )

  return queryResult
}
