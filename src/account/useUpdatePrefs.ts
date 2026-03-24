import type { ResultOf, VariablesOf } from 'gql.tada'
import { graphql as gql } from 'gql.tada'

import { Keys } from '../query/Keys'
import type { AppwriteException, Prettify } from '../types'
import { useAppwrite } from '../useAppwrite'
import { useMutation } from '../useMutation'
import { useQueryClient } from '../useQueryClient'

export const accountUpdatePrefs = gql(/* GraphQL */ `
  mutation UpdatePrefs($prefs: Assoc!) {
    accountUpdatePrefs(prefs: $prefs) {
      prefs {
        data
      }
    }
  }
`)

/** The variables accepted by the {@link useUpdatePrefs} mutation. */
export type UpdatePrefsVariables = Prettify<VariablesOf<typeof accountUpdatePrefs>>
/** The result returned by the {@link useUpdatePrefs} mutation. */
export type UpdatePrefsResult = Prettify<ResultOf<typeof accountUpdatePrefs>['accountUpdatePrefs']>

/**
 * Mutation hook to update the current user's account preferences.
 *
 * Accepts an `Assoc` (key-value map) of preferences. Invalidates account
 * queries on success so that components reading preferences reflect the
 * updated values.
 *
 * @example
 * ```tsx
 * const { mutate, isPending } = useUpdatePrefs()
 *
 * mutate({
 *   prefs: { theme: 'dark', locale: 'en-US' },
 * })
 * ```
 *
 * **Variables** ({@link UpdatePrefsVariables}):
 * - `prefs` — A key-value object of account preferences to set
 *
 * @returns A `UseMutationResult` with the updated `prefs` containing a `data` field.
 */
export function useUpdatePrefs() {
  const { graphql } = useAppwrite()
  const queryClient = useQueryClient()

  const queryResult = useMutation<UpdatePrefsResult, AppwriteException[], UpdatePrefsVariables>({
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

  return queryResult
}
