// FIXME: This is a temporary solution to update user preferences.
import { AppwriteException } from '../types'

import { gql } from '../__generated__'
import { UpdatePrefsMutation } from '../__generated__/graphql'
import { useAppwrite } from '../useAppwrite'
import { useMutation } from '../useMutation'
import { useQueryClient } from '../useQueryClient'

const accountUpdatePrefs = gql(/* GraphQL */ `
  mutation UpdatePrefs($prefs: Json!) {
    accountUpdatePrefs(prefs: $prefs) {
      prefs {
        data
      }
    }
  }
`)

export function useUpdatePrefs() {
  const { account } = useAppwrite()
  const queryClient = useQueryClient()

  const queryResult = useMutation<
    UpdatePrefsMutation['accountUpdatePrefs'],
    AppwriteException[],
    { prefs: Record<string, string | number | boolean> }
  >({
    mutationFn: async ({ prefs }) => {
      const newPrefs = await account.updatePrefs({ prefs })
      return newPrefs
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appwrite', 'account'] })
    },
  })

  return { ...queryResult }
}
