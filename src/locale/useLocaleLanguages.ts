import type { ResultOf } from 'gql.tada'
import { graphql as gql } from 'gql.tada'

import { Keys } from '../query/Keys'
import type { AppwriteException } from '../types'
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

type Result = ResultOf<typeof listLanguages>['localeListLanguages']

export function useLocaleLanguages() {
  const { graphql } = useAppwrite()

  const queryResult = useQuery<Result, AppwriteException[], Result>({
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

  return { ...queryResult }
}
