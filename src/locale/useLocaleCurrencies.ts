import type { ResultOf } from 'gql.tada'
import { graphql as gql } from 'gql.tada'

import { Keys } from '../query/Keys'
import type { AppwriteException } from '../types'
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

type Result = ResultOf<typeof listCurrencies>['localeListCurrencies']

export function useLocaleCurrencies() {
  const { graphql } = useAppwrite()

  const queryResult = useQuery<Result, AppwriteException[], Result>({
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
  })

  return { ...queryResult }
}
