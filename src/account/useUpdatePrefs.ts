import { AppwriteException } from '../types'

import { gql } from '../__generated__'
import { UpdatePrefsMutation, UpdatePrefsMutationVariables } from '../__generated__/graphql'
import { useAppwrite } from '../useAppwrite'
import { useMutation } from '../useMutation'
import { useQueryClient } from '../useQueryClient'

const accountUpdatePrefs = gql(/* GraphQL */ `
  mutation UpdatePrefs($prefs: Assoc!) {
    accountUpdatePrefs(prefs: $prefs) {
      prefs {
        data
      }
    }
  }
`)

export function useUpdatePrefs() {
  const { graphql } = useAppwrite()
  const queryClient = useQueryClient()

  const queryResult = useMutation<
    UpdatePrefsMutation['accountUpdatePrefs'],
    AppwriteException[],
    UpdatePrefsMutationVariables
  >({
    mutationFn: async ({ prefs }) => {
      const { data, errors } = await graphql.mutation({
        query: accountUpdatePrefs,
        variables: { prefs },
      })

      if (errors) {
        throw errors
      }

      return data?.accountUpdatePrefs
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appwrite', 'account'] })
    },
  })

  return { ...queryResult }
}
