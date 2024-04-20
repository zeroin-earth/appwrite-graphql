import { UseMutationOptions } from '@tanstack/react-query'
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

export function useUpdatePrefs({
  options,
}: {
  options?: UseMutationOptions<
    UpdatePrefsMutation['accountUpdatePrefs'],
    AppwriteException,
    { prefs: Record<string, string | number | boolean> },
    string[]
  >
}) {
  const { graphql } = useAppwrite()

  const queryResult = useMutation({
    mutationFn: async ({ prefs }) => {
      const { data, errors } = await graphql.mutation({
        query: accountUpdatePrefs,
        variables: {
          prefs,
        },
      })

      if (errors) {
        throw errors
      }

      return data.accountUpdatePrefs
    },
    ...options,
  })

  return { ...queryResult }
}
