import { AppwriteException } from '../types'

import { gql } from '../__generated__'
import { ListLanguagesQuery } from '../__generated__/graphql'
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

export function useLocaleLanguages() {
  const { graphql } = useAppwrite()

  const queryResult = useQuery<
    ListLanguagesQuery['localeListLanguages'],
    AppwriteException[],
    ListLanguagesQuery['localeListLanguages']
  >({
    queryKey: ['appwrite', 'locale', 'languages'],
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
