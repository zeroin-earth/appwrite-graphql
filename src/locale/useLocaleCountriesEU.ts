import { gql } from '../__generated__'
import type { ListCountriesEuQuery } from '../__generated__/graphql'
import type { AppwriteException } from '../types'
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

export function useLocaleCountriesEU() {
  const { graphql } = useAppwrite()

  const queryResult = useQuery<
    ListCountriesEuQuery['localeListCountriesEU'],
    AppwriteException[],
    ListCountriesEuQuery['localeListCountriesEU']
  >({
    queryKey: ['appwrite', 'locale', 'countries-eu'],
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

  return { ...queryResult }
}
