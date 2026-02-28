import { gql } from '../__generated__'
import type { ListCurrenciesQuery } from '../__generated__/graphql'
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

export function useLocaleCurrencies() {
  const { graphql } = useAppwrite()

  const queryResult = useQuery<
    ListCurrenciesQuery['localeListCurrencies'],
    AppwriteException[],
    ListCurrenciesQuery['localeListCurrencies']
  >({
    queryKey: ['appwrite', 'locale', 'currencies'],
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
