import type { ResultOf } from 'gql.tada'
import { graphql as gql } from 'gql.tada'

import { Keys } from '../query/Keys'
import type { AppwriteException, Prettify } from '../types'
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

/** The result returned by the {@link useLocaleCodes} hook. */
export type LocaleCodesResult = Prettify<ResultOf<typeof listLocaleCodes>['localeListCodes']>

/**
 * Fetches the list of available locale codes.
 *
 * @example
 * ```tsx
 * const { data, isLoading } = useLocaleCodes()
 *
 * // data.localeCodes — array of { code, name }
 * ```
 *
 * @returns A `UseQueryResult` with the available locale codes ({@link LocaleCodesResult}).
 */
export function useLocaleCodes() {
  const { graphql } = useAppwrite()

  const queryResult = useQuery<LocaleCodesResult, AppwriteException[], LocaleCodesResult>({
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

  return queryResult
}
