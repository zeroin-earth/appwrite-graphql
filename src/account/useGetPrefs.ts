import { AppwriteException } from 'appwrite'

import { gql } from '../__generated__'
import { GetPrefsQuery } from '../__generated__/graphql'
import { useAppwrite } from '../useAppwrite'
import { useQuery } from '../useQuery'

const accountGetPrefs = gql(/* GraphQL */ `
  query GetPrefs {
    accountGetPrefs {
      data
    }
  }
`)

export function useGetPrefs() {
  const { graphql } = useAppwrite()

  const queryResult = useQuery<
    GetPrefsQuery['accountGetPrefs'],
    AppwriteException[],
    GetPrefsQuery['accountGetPrefs']
  >({
    queryKey: ['appwrite', 'account', 'prefs'],
    queryFn: async () => {
      const { data, errors } = await graphql.query({
        query: accountGetPrefs,
      })

      if (errors) {
        throw errors
      }

      return data.accountGetPrefs
    },
  })

  return { ...queryResult }
}
