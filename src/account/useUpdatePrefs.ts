// FIXME: This is a temporary solution to update user preferences.
import { AppwriteException } from '../types'

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
  const { account } = useAppwrite()

  const queryResult = useMutation<
    UpdatePrefsMutation['accountUpdatePrefs'],
    AppwriteException[],
    { prefs: Record<string, string | number | boolean> }
  >({
    mutationFn: async ({ prefs }) => {
      const newPrefs = await account.updatePrefs(prefs)
      return newPrefs
    },
  })

  return { ...queryResult }
}
