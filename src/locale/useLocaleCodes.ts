import { gql } from '../__generated__'
import type { ListLocaleCodesQuery } from '../__generated__/graphql'
import type { AppwriteException } from '../types'
import { useAppwrite } from '../useAppwrite'
import { useQuery } from '../useQuery'

const listLocaleCodes = gql(/* GraphQL */ `
  query ListLocaleCodes {
    localeListCodes {
      total
      localeCodes {
        code
        name
      }
    }
  }
`)

export function useLocaleCodes() {
  const { graphql } = useAppwrite()

  const queryResult = useQuery<
    ListLocaleCodesQuery['localeListCodes'],
    AppwriteException[],
    ListLocaleCodesQuery['localeListCodes']
  >({
    queryKey: ['appwrite', 'locale', 'codes'],
    queryFn: async () => {
      const { data, errors } = await graphql.query({
        query: listLocaleCodes,
      })

      if (errors) {
        throw errors
      }

      return data.localeListCodes
    },
  })

  return { ...queryResult }
}
