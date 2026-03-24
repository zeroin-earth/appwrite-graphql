import type { ResultOf, VariablesOf } from 'gql.tada'
import { graphql as gql } from 'gql.tada'

import { Keys } from '../query/Keys'
import type { AppwriteException, Prettify } from '../types'
import { useAppwrite } from '../useAppwrite'
import { useMutation } from '../useMutation'
import { useQueryClient } from '../useQueryClient'

export const createMembership = gql(/* GraphQL */ `
  mutation CreateMembership(
    $teamId: String!
    $roles: [String!]!
    $email: String
    $userId: String
    $phone: String
    $url: String
    $name: String
  ) {
    teamsCreateMembership(
      teamId: $teamId
      roles: $roles
      email: $email
      userId: $userId
      phone: $phone
      url: $url
      name: $name
    ) {
      _id
      userId
      teamId
      roles
      confirm
    }
  }
`)

/** The variables accepted by the {@link useCreateMembership} hook. */
export type CreateMembershipVariables = Prettify<VariablesOf<typeof createMembership>>

/** The result returned by the {@link useCreateMembership} hook. */
export type CreateMembershipResult = Prettify<
  ResultOf<typeof createMembership>['teamsCreateMembership']
>

/**
 * Mutation to invite a user to a team.
 *
 * Sends the `CreateMembership` GraphQL mutation. At least one of `email`, `userId`,
 * or `phone` must be provided to identify the invitee. On success, invalidates both
 * the membership list and the individual team cache.
 *
 * @example
 * ```tsx
 * const { mutate, isPending } = useCreateMembership()
 *
 * mutate({
 *   teamId: '64a1b2c3d4e5f',
 *   roles: ['developer'],
 *   email: 'alice@example.com',
 *   url: 'https://myapp.com/accept-invite',
 *   name: 'Alice',
 * })
 * ```
 *
 * **Variables** ({@link CreateMembershipVariables}):
 * - `teamId` — The ID of the team to invite the user to
 * - `roles` — An array of roles to assign to the new member
 * - `email` — Optional. The invitee's email address
 * - `userId` — Optional. The invitee's user ID
 * - `phone` — Optional. The invitee's phone number
 * - `url` — Optional. A URL the invitee is redirected to for accepting the invitation
 * - `name` — Optional. The invitee's display name
 *
 * @returns A `UseMutationResult` whose `data` is the created {@link CreateMembershipResult} with `_id`, `userId`, `teamId`, `roles`, and `confirm`.
 */
export function useCreateMembership() {
  const { graphql } = useAppwrite()
  const queryClient = useQueryClient()

  const mutationResult = useMutation<
    CreateMembershipResult,
    AppwriteException[],
    CreateMembershipVariables
  >({
    mutationKey: Keys.teams().memberships().create(),
    mutationFn: async ({ teamId, roles, email, userId, phone, url, name }) => {
      const { data, errors } = await graphql.mutation({
        query: createMembership,
        variables: { teamId, roles, email, userId, phone, url, name },
      })

      if (errors) {
        throw errors
      }

      return data.teamsCreateMembership
    },
    onSuccess: (_, variables) => {
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
