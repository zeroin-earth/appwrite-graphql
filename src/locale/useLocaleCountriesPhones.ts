import { gql } from '../__generated__'
import type { ListCountriesPhonesQuery } from '../__generated__/graphql'
import type { AppwriteException } from '../types'
import { useAppwrite } from '../useAppwrite'
import { useQuery } from '../useQuery'

const listCountriesPhones = gql(/* GraphQL */ `
  query ListCountriesPhones {
    localeListCountriesPhones {
      total
      phones {
        code
        countryCode
        countryName
      }
    }
  }
`)

export function useLocaleCountriesPhones() {
  const { graphql } = useAppwrite()

  const queryResult = useQuery<
    ListCountriesPhonesQuery['localeListCountriesPhones'],
    AppwriteException[],
    ListCountriesPhonesQuery['localeListCountriesPhones']
  >({
    queryKey: ['appwrite', 'locale', 'countries-phones'],
    queryFn: async () => {
      const { data, errors } = await graphql.query({
        query: listCountriesPhones,
      })

      if (errors) {
        throw errors
      }

      return data.localeListCountriesPhones
    },
  })

  return { ...queryResult }
}
