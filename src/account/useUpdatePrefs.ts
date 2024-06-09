import { AppwriteException } from 'appwrite'

import { gql } from '../__generated__'
import { UpdatePrefsMutation } from '../__generated__/graphql'
import { useAppwrite } from '../useAppwrite'
import { useMutation } from '../useMutation'

const accountUpdatePrefs = gql(/* GraphQL */ `
  mutation UpdatePrefs($prefs: JSON!) {
    accountUpdatePrefs(prefs: $prefs) {
      prefs {
        data
      }
    }
  }
`)

export function useUpdatePrefs() {
  const { graphql } = useAppwrite()

  const queryResult = useMutation<
    UpdatePrefsMutation['accountUpdatePrefs'],
    AppwriteException,
    { prefs: Record<string, string | number | boolean> }
  >({
    mutationFn: async ({ prefs }) => {
      const { data, errors } = await graphql.mutation({
        query: accountUpdatePrefs,
        variables: {
          prefs: JSON.stringify(prefs),
        },
      })

      if (errors) {
        throw errors
      }

      return data.accountUpdatePrefs
    },
  })

  return { ...queryResult }
}
