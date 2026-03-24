import type { ResultOf, VariablesOf } from 'gql.tada'
import { graphql as gql } from 'gql.tada'

import { Keys } from '../query/Keys'
import type { AppwriteException, Prettify } from '../types'
import { useAppwrite } from '../useAppwrite'
import { useMutation } from '../useMutation'
import { useQueryClient } from '../useQueryClient'

const updateMembershipStatus = gql(/* GraphQL */ `
  mutation UpdateMembershipStatus(
    $teamId: String!
    $membershipId: String!
    $userId: String!
    $secret: String!
  ) {
    teamsUpdateMembershipStatus(
      teamId: $teamId
      membershipId: $membershipId
      userId: $userId
      secret: $secret
    ) {
      _id
      confirm
    }
  }
`)

/** The variables accepted by the {@link useUpdateMembershipStatus} hook. */
export type UpdateMembershipStatusVariables = Prettify<VariablesOf<typeof updateMembershipStatus>>

/** The result returned by the {@link useUpdateMembershipStatus} hook. */
export type UpdateMembershipStatusResult = Prettify<
  ResultOf<typeof updateMembershipStatus>['teamsUpdateMembershipStatus']
>

/**
 * Mutation to accept a team invitation.
 *
 * Sends the `UpdateMembershipStatus` GraphQL mutation using the invitation secret.
 * Typically called after a user clicks an invitation link. Invalidates the membership
 * list cache for the team on success.
 *
 * @example
 * ```tsx
 * const { mutate, isPending } = useUpdateMembershipStatus()
 *
 * // Values are typically extracted from the invitation URL
 * mutate({
 *   teamId: '64a1b2c3d4e5f',
 *   membershipId: '71b2c3d4e5f6a',
 *   userId: 'user_123',
 *   secret: 'invite-secret-token',
 * })
 * ```
 *
 * **Variables** ({@link UpdateMembershipStatusVariables}):
 * - `teamId` — The ID of the team the user is joining
 * - `membershipId` — The ID of the membership invitation
 * - `userId` — The ID of the user accepting the invitation
 * - `secret` — The invitation secret from the invite URL
 *
 * @returns A `UseMutationResult` whose `data` is the updated {@link UpdateMembershipStatusResult} with `_id` and `confirm`.
 */
export function useUpdateMembershipStatus() {
  const { graphql } = useAppwrite()
  const queryClient = useQueryClient()

  const mutationResult = useMutation<
    UpdateMembershipStatusResult,
    AppwriteException[],
    UpdateMembershipStatusVariables
  >({
    mutationKey: Keys.teams().membershipStatus().update(),
    mutationFn: async ({ teamId, membershipId, userId, secret }) => {
      const { data, errors } = await graphql.mutation({
        query: updateMembershipStatus,
        variables: { teamId, membershipId, userId, secret },
      })

      if (errors) {
        throw errors
      }

      return data.teamsUpdateMembershipStatus
    },
    onSuccess: (_, variables) => {
      void queryClient.invalidateQueries({
        queryKey: Keys.team(variables.teamId).memberships().key(),
      })
    },
  })

  return mutationResult
}
