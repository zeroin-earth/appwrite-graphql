import { gql } from '../__generated__'
import type { ListContinentsQuery } from '../__generated__/graphql'
import type { AppwriteException } from '../types'
import { useAppwrite } from '../useAppwrite'
import { useQuery } from '../useQuery'

const listContinents = gql(/* GraphQL */ `
  query ListContinents {
    localeListContinents {
      total
      continents {
        name
        code
      }
    }
  }
`)

export function useLocaleContinents() {
  const { graphql } = useAppwrite()

  const queryResult = useQuery<
    ListContinentsQuery['localeListContinents'],
    AppwriteException[],
    ListContinentsQuery['localeListContinents']
  >({
    queryKey: ['appwrite', 'locale', 'continents'],
    queryFn: async () => {
      const { data, errors } = await graphql.query({
        query: listContinents,
      })

      if (errors) {
        throw errors
      }

      return data.localeListContinents
    },
  })

  return { ...queryResult }
}
