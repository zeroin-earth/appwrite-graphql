import type { ResultOf } from 'gql.tada'
import { graphql as gql } from 'gql.tada'

import { Keys } from '../query/Keys'
import type { AppwriteException, Prettify } from '../types'
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

/** The result returned by the {@link useLocaleContinents} hook. */
export type LocaleContinentsResult = Prettify<
  ResultOf<typeof listContinents>['localeListContinents']
>

/**
 * Fetches the list of continents with their names and codes.
 *
 * @example
 * ```tsx
 * const { data, isLoading } = useLocaleContinents()
 *
 * // data.continents — array of { name, code }
 * ```
 *
 * @returns A `UseQueryResult` with the list of continents ({@link LocaleContinentsResult}).
 */
export function useLocaleContinents() {
  const { graphql } = useAppwrite()

  const queryResult = useQuery<LocaleContinentsResult, AppwriteException[], LocaleContinentsResult>(
    {
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
    },
  )

  return queryResult
}
