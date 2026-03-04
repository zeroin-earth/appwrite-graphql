import type { ResultOf } from 'gql.tada'
import { graphql as gql } from 'gql.tada'

import { Keys } from '../query/Keys'
import type { AppwriteException } from '../types'
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

type Result = ResultOf<typeof getLocale>['localeGet']

export function useLocale() {
  const { graphql } = useAppwrite()

  const queryResult = useQuery<Result, AppwriteException[], Result>({
    queryKey: Keys.locale().key(),
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
