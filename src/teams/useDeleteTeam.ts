import type { ResultOf, VariablesOf } from 'gql.tada'
import { graphql as gql } from 'gql.tada'

import { Keys } from '../query/Keys'
import type { AppwriteException, Prettify } from '../types'
import { useAppwrite } from '../useAppwrite'
import { useMutation } from '../useMutation'
import { useQueryClient } from '../useQueryClient'

export const deleteTeam = gql(/* GraphQL */ `
  mutation DeleteTeam($teamId: String!) {
    teamsDelete(teamId: $teamId) {
      status
    }
  }
`)

/** The variables accepted by the {@link useDeleteTeam} hook. */
export type DeleteTeamVariables = Prettify<VariablesOf<typeof deleteTeam>>

/** The result returned by the {@link useDeleteTeam} hook. */
export type DeleteTeamResult = Prettify<ResultOf<typeof deleteTeam>['teamsDelete']>

/**
 * Mutation to delete a team by its ID.
 *
 * Sends the `DeleteTeam` GraphQL mutation. On success, removes the individual team
 * query from the cache and invalidates the team list cache.
 *
 * @example
 * ```tsx
 * const { mutate, isPending } = useDeleteTeam()
 *
 * mutate({ teamId: '64a1b2c3d4e5f' })
 * ```
 *
 * **Variables** ({@link DeleteTeamVariables}):
 * - `teamId` — The ID of the team to delete
 *
 * @returns A `UseMutationResult` whose `data` is a {@link DeleteTeamResult} with a `status` field.
 */
export function useDeleteTeam() {
  const { graphql } = useAppwrite()
  const queryClient = useQueryClient()

  const mutationResult = useMutation<DeleteTeamResult, AppwriteException[], DeleteTeamVariables>({
    mutationKey: Keys.teams().delete(),
    mutationFn: async ({ teamId }) => {
      const { data, errors } = await graphql.mutation({
        query: deleteTeam,
        variables: { teamId },
      })

      if (errors) {
        throw errors
      }

      return data?.teamsDelete ?? { status: '' }
    },
    onSuccess: (_, variables) => {
      queryClient.removeQueries({
        queryKey: Keys.team(variables.teamId).key(),
      })
      void queryClient.invalidateQueries({ queryKey: Keys.teams().key() })
    },
  })

  return mutationResult
}
