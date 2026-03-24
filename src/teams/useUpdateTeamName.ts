import type { ResultOf, VariablesOf } from 'gql.tada'
import { graphql as gql } from 'gql.tada'

import { Keys } from '../query/Keys'
import type { AppwriteException, Prettify } from '../types'
import { useAppwrite } from '../useAppwrite'
import { useMutation } from '../useMutation'
import { useQueryClient } from '../useQueryClient'

export const updateTeamName = gql(/* GraphQL */ `
  mutation UpdateTeamName($teamId: String!, $name: String!) {
    teamsUpdateName(teamId: $teamId, name: $name) {
      _id
      name
    }
  }
`)

/** The variables accepted by the {@link useUpdateTeamName} hook. */
export type UpdateTeamNameVariables = Prettify<VariablesOf<typeof updateTeamName>>

/** The result returned by the {@link useUpdateTeamName} hook. */
export type UpdateTeamNameResult = Prettify<ResultOf<typeof updateTeamName>['teamsUpdateName']>

/**
 * Mutation to update a team's name.
 *
 * Sends the `UpdateTeamName` GraphQL mutation. On success, invalidates both the
 * individual team cache and the team list cache.
 *
 * @example
 * ```tsx
 * const { mutate, isPending } = useUpdateTeamName()
 *
 * mutate({
 *   teamId: '64a1b2c3d4e5f',
 *   name: 'Platform Engineering',
 * })
 * ```
 *
 * **Variables** ({@link UpdateTeamNameVariables}):
 * - `teamId` — The ID of the team to rename
 * - `name` — The new display name for the team
 *
 * @returns A `UseMutationResult` whose `data` is the updated {@link UpdateTeamNameResult} with `_id` and `name`.
 */
export function useUpdateTeamName() {
  const { graphql } = useAppwrite()
  const queryClient = useQueryClient()

  const mutationResult = useMutation<
    UpdateTeamNameResult,
    AppwriteException[],
    UpdateTeamNameVariables
  >({
    mutationKey: Keys.teams().teamName().update(),
    mutationFn: async ({ teamId, name }) => {
      const { data, errors } = await graphql.mutation({
        query: updateTeamName,
        variables: { teamId, name },
      })

      if (errors) {
        throw errors
      }

      return data.teamsUpdateName
    },
    onSuccess: (_, variables) => {
      void queryClient.invalidateQueries({
        queryKey: Keys.team(variables.teamId).key(),
      })
      void queryClient.invalidateQueries({ queryKey: Keys.teams().key() })
    },
  })

  return mutationResult
}
