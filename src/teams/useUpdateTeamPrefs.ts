import type { ResultOf, VariablesOf } from 'gql.tada'
import { graphql as gql } from 'gql.tada'

import { Keys } from '../query/Keys'
import type { AppwriteException, Prettify } from '../types'
import { useAppwrite } from '../useAppwrite'
import { useMutation } from '../useMutation'
import { useQueryClient } from '../useQueryClient'

export const updateTeamPrefs = gql(/* GraphQL */ `
  mutation UpdateTeamPrefs($teamId: String!, $prefs: Assoc!) {
    teamsUpdatePrefs(teamId: $teamId, prefs: $prefs) {
      data
    }
  }
`)

/** The variables accepted by the {@link useUpdateTeamPrefs} hook. */
export type UpdateTeamPrefsVariables = Prettify<VariablesOf<typeof updateTeamPrefs>>

/** The result returned by the {@link useUpdateTeamPrefs} hook. */
export type UpdateTeamPrefsResult = Prettify<ResultOf<typeof updateTeamPrefs>['teamsUpdatePrefs']>

/**
 * Mutation to update a team's preferences.
 *
 * Sends the `UpdateTeamPrefs` GraphQL mutation with an arbitrary key-value object.
 * Invalidates the individual team cache on success.
 *
 * @example
 * ```tsx
 * const { mutate, isPending } = useUpdateTeamPrefs()
 *
 * mutate({
 *   teamId: '64a1b2c3d4e5f',
 *   prefs: { theme: 'dark', notificationsEnabled: true },
 * })
 * ```
 *
 * **Variables** ({@link UpdateTeamPrefsVariables}):
 * - `teamId` — The ID of the team whose preferences to update
 * - `prefs` — An associative object of key-value preferences to set
 *
 * @returns A `UseMutationResult` whose `data` is the updated {@link UpdateTeamPrefsResult} containing a `data` field with the new preferences.
 */
export function useUpdateTeamPrefs() {
  const { graphql } = useAppwrite()
  const queryClient = useQueryClient()

  const mutationResult = useMutation<
    UpdateTeamPrefsResult,
    AppwriteException[],
    UpdateTeamPrefsVariables
  >({
    mutationKey: Keys.teams().teamPrefs().update(),
    mutationFn: async ({ teamId, prefs }) => {
      const { data, errors } = await graphql.mutation({
        query: updateTeamPrefs,
        variables: { teamId, prefs },
      })

      if (errors) {
        throw errors
      }

      return data.teamsUpdatePrefs
    },
    onSuccess: (_, variables) => {
      void queryClient.invalidateQueries({
        queryKey: Keys.team(variables.teamId).key(),
      })
    },
  })

  return mutationResult
}
