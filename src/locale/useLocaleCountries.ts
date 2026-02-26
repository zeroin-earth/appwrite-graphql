import { AppwriteException } from '../types'

import { gql } from '../__generated__'
import { ListCountriesQuery } from '../__generated__/graphql'
import { useAppwrite } from '../useAppwrite'
import { useQuery } from '../useQuery'

const listCountries = gql(/* GraphQL */ `
  query ListCountries {
    localeListCountries {
      total
      countries {
        name
        code
      }
    }
  }
`)

export function useLocaleCountries() {
  const { graphql } = useAppwrite()

  const queryResult = useQuery<
    ListCountriesQuery['localeListCountries'],
    AppwriteException[],
    ListCountriesQuery['localeListCountries']
  >({
    queryKey: ['appwrite', 'locale', 'countries'],
    queryFn: async () => {
      const { data, errors } = await graphql.query({
        query: listCountries,
      })

      if (errors) {
        throw errors
      }

      return data.localeListCountries
    },
  })

  return { ...queryResult }
}
