import type { ResultOf, VariablesOf } from 'gql.tada'
import { graphql as gql } from 'gql.tada'

import { Keys } from '../query/Keys'
import type { AppwriteException, Prettify, QueryOptions } from '../types'
import { useAppwrite } from '../useAppwrite'
import { useQuery } from '../useQuery'

const getMembership = gql(/* GraphQL */ `
  query GetMembership($teamId: String!, $membershipId: String!) {
    teamsGetMembership(teamId: $teamId, membershipId: $membershipId) {
      _id
      _createdAt
      _updatedAt
      userId
      userName
      userEmail
      teamId
      teamName
      invited
      joined
      confirm
      mfa
      roles
    }
  }
`)

/** The variables accepted by the {@link useTeamMembership} hook. */
export type TeamMembershipVariables = Prettify<VariablesOf<typeof getMembership>>

/** The result returned by the {@link useTeamMembership} hook. */
export type TeamMembershipResult = Prettify<ResultOf<typeof getMembership>['teamsGetMembership']>

/**
 * Fetches a specific team membership by team and membership ID.
 *
 * @example
 * ```tsx
 * const { data, isLoading } = useTeamMembership({
 *   teamId: 'engineering',
 *   membershipId: '7a3f…',
 * })
 *
 * // data.userName, data.userEmail, data.roles
 * ```
 *
 * **Parameters** ({@link TeamMembershipVariables}):
 * - `teamId` — The unique team identifier.
 * - `membershipId` — The unique membership identifier.
 *
 * @returns A `UseQueryResult` with the membership details ({@link TeamMembershipResult}).
 */
export function useTeamMembership(
  { teamId, membershipId }: TeamMembershipVariables,
  opts: QueryOptions = {},
) {
  const { graphql } = useAppwrite()

  const queryResult = useQuery<TeamMembershipResult, AppwriteException[], TeamMembershipResult>({
    queryKey: Keys.team(teamId).membership(membershipId).key(),
    queryFn: async () => {
      const { data, errors } = await graphql.query({
        query: getMembership,
        variables: { teamId, membershipId },
      })

      if (errors) {
        throw errors
      }

      return data.teamsGetMembership
    },
    ...opts,
  })

  return queryResult
}
