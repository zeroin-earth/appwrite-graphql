import type { ResultOf, VariablesOf } from 'gql.tada'
import { graphql as gql } from 'gql.tada'

import { Keys } from '../query/Keys'
import type { AppwriteException, Prettify } from '../types'
import { useAppwrite } from '../useAppwrite'
import { useMutation } from '../useMutation'
import { useQueryClient } from '../useQueryClient'

export const updateMembership = gql(/* GraphQL */ `
  mutation UpdateMembership($teamId: String!, $membershipId: String!, $roles: [String!]!) {
    teamsUpdateMembership(teamId: $teamId, membershipId: $membershipId, roles: $roles) {
      _id
      roles
    }
  }
`)

/** The variables accepted by the {@link useUpdateMembership} hook. */
export type UpdateMembershipVariables = Prettify<VariablesOf<typeof updateMembership>>

/** The result returned by the {@link useUpdateMembership} hook. */
export type UpdateMembershipResult = Prettify<
  ResultOf<typeof updateMembership>['teamsUpdateMembership']
>

/**
 * Mutation to update a team membership's roles.
 *
 * Sends the `UpdateMembership` GraphQL mutation and invalidates the membership list
 * cache for the team on success.
 *
 * @example
 * ```tsx
 * const { mutate, isPending } = useUpdateMembership()
 *
 * mutate({
 *   teamId: '64a1b2c3d4e5f',
 *   membershipId: '71b2c3d4e5f6a',
 *   roles: ['admin', 'developer'],
 * })
 * ```
 *
 * **Variables** ({@link UpdateMembershipVariables}):
 * - `teamId` — The ID of the team containing the membership
 * - `membershipId` — The ID of the membership to update
 * - `roles` — The new array of roles to assign to the member
 *
 * @returns A `UseMutationResult` whose `data` is the updated {@link UpdateMembershipResult} with `_id` and `roles`.
 */
export function useUpdateMembership() {
  const { graphql } = useAppwrite()
  const queryClient = useQueryClient()

  const mutationResult = useMutation<
    UpdateMembershipResult,
    AppwriteException[],
    UpdateMembershipVariables
  >({
    mutationKey: Keys.teams().memberships().update(),
    mutationFn: async ({ teamId, membershipId, roles }) => {
      const { data, errors } = await graphql.mutation({
        query: updateMembership,
        variables: { teamId, membershipId, roles },
      })

      if (errors) {
        throw errors
      }

      return data.teamsUpdateMembership
    },
    onSuccess: (_, variables) => {
      void queryClient.invalidateQueries({
        queryKey: Keys.team(variables.teamId).memberships().key(),
      })
    },
  })

  return mutationResult
}
