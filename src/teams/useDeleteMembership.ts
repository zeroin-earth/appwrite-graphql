import type { ResultOf, VariablesOf } from 'gql.tada'
import { graphql as gql } from 'gql.tada'

import { Keys } from '../query/Keys'
import type { AppwriteException, Prettify } from '../types'
import { useAppwrite } from '../useAppwrite'
import { useMutation } from '../useMutation'
import { useQueryClient } from '../useQueryClient'

export const deleteMembership = gql(/* GraphQL */ `
  mutation DeleteMembership($teamId: String!, $membershipId: String!) {
    teamsDeleteMembership(teamId: $teamId, membershipId: $membershipId) {
      status
    }
  }
`)

/** The variables accepted by the {@link useDeleteMembership} hook. */
export type DeleteMembershipVariables = Prettify<VariablesOf<typeof deleteMembership>>

/** The result returned by the {@link useDeleteMembership} hook. */
export type DeleteMembershipResult = Prettify<
  ResultOf<typeof deleteMembership>['teamsDeleteMembership']
>

/**
 * Mutation to remove a member from a team.
 *
 * Sends the `DeleteMembership` GraphQL mutation. On success, removes the individual
 * membership query from the cache and invalidates both the membership list and the
 * individual team cache.
 *
 * @example
 * ```tsx
 * const { mutate, isPending } = useDeleteMembership()
 *
 * mutate({
 *   teamId: '64a1b2c3d4e5f',
 *   membershipId: '71b2c3d4e5f6a',
 * })
 * ```
 *
 * **Variables** ({@link DeleteMembershipVariables}):
 * - `teamId` — The ID of the team containing the membership
 * - `membershipId` — The ID of the membership to remove
 *
 * @returns A `UseMutationResult` whose `data` is a {@link DeleteMembershipResult} with a `status` field.
 */
export function useDeleteMembership() {
  const { graphql } = useAppwrite()
  const queryClient = useQueryClient()

  const mutationResult = useMutation<
    DeleteMembershipResult,
    AppwriteException[],
    DeleteMembershipVariables
  >({
    mutationKey: Keys.teams().memberships().delete(),
    mutationFn: async ({ teamId, membershipId }) => {
      const { data, errors } = await graphql.mutation({
        query: deleteMembership,
        variables: { teamId, membershipId },
      })

      if (errors) {
        throw errors
      }

      return data?.teamsDeleteMembership ?? { status: '' }
    },
    onSuccess: (_, variables) => {
      queryClient.removeQueries({
        queryKey: Keys.team(variables.teamId).membership(variables.membershipId).key(),
      })
      void queryClient.invalidateQueries({
        queryKey: Keys.team(variables.teamId).memberships().key(),
      })
      void queryClient.invalidateQueries({
        queryKey: Keys.team(variables.teamId).key(),
      })
    },
  })

  return mutationResult
}
