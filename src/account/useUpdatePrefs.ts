import type { ResultOf, VariablesOf } from 'gql.tada'
import { graphql as gql } from 'gql.tada'

import { Keys } from '../query/Keys'
import type { AppwriteException } from '../types'
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

type Variables = VariablesOf<typeof accountUpdatePrefs>
type Result = ResultOf<typeof accountUpdatePrefs>['accountUpdatePrefs']

export function useUpdatePrefs() {
  const { graphql } = useAppwrite()
  const queryClient = useQueryClient()

  const queryResult = useMutation<Result, AppwriteException[], Variables>({
    mutationKey: Keys.account().prefs().update(),
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
      void queryClient.invalidateQueries({ queryKey: Keys.account().key() })
    },
  })

  return { ...queryResult }
}
