import type { ResultOf } from 'gql.tada'
import { graphql as gql } from 'gql.tada'

import { Keys } from '../query/Keys'
import type { AppwriteException, Prettify } from '../types'
import { useAppwrite } from '../useAppwrite'
import { useQuery } from '../useQuery'

const listLanguages = gql(/* GraphQL */ `
  query ListLanguages {
    localeListLanguages {
      total
      languages {
        name
        code
        nativeName
      }
    }
  }
`)

/** The result returned by the {@link useLocaleLanguages} hook. */
export type LocaleLanguagesResult = Prettify<ResultOf<typeof listLanguages>['localeListLanguages']>

/**
 * Fetches the list of languages with their names, codes, and native names.
 *
 * @example
 * ```tsx
 * const { data, isLoading } = useLocaleLanguages()
 *
 * // data.languages — array of { name, code, nativeName }
 * ```
 *
 * @returns A `UseQueryResult` with the list of languages ({@link LocaleLanguagesResult}).
 */
export function useLocaleLanguages() {
  const { graphql } = useAppwrite()

  const queryResult = useQuery<LocaleLanguagesResult, AppwriteException[], LocaleLanguagesResult>({
    queryKey: Keys.locale().languages(),
    queryFn: async () => {
      const { data, errors } = await graphql.query({
        query: listLanguages,
      })

      if (errors) {
        throw errors
      }

      return data.localeListLanguages
    },
  })

  return queryResult
}
