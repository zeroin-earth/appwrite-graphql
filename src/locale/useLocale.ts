import { AppwriteException } from '../types'

import { gql } from '../__generated__'
import { GetLocaleQuery } from '../__generated__/graphql'
import { useAppwrite } from '../useAppwrite'
import { useQuery } from '../useQuery'

const getLocale = gql(/* GraphQL */ `
  query GetLocale {
    localeGet {
      ip
      countryCode
      country
      continentCode
      continent
      eu
      currency
    }
  }
`)

export function useLocale() {
  const { graphql } = useAppwrite()

  const queryResult = useQuery<
    GetLocaleQuery['localeGet'],
    AppwriteException[],
    GetLocaleQuery['localeGet']
  >({
    queryKey: ['appwrite', 'locale'],
    queryFn: async () => {
      const { data, errors } = await graphql.query({
        query: getLocale,
      })

      if (errors) {
        throw errors
      }

      return data.localeGet
    },
  })

  return { ...queryResult }
}
