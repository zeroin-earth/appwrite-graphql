import type { ResultOf } from 'gql.tada'
import { graphql as gql } from 'gql.tada'

import { Keys } from '../query/Keys'
import type { AppwriteException, Prettify, QueryOptions } from '../types'
import { useAppwrite } from '../useAppwrite'
import { useQuery } from '../useQuery'

const listMemberships = gql(/* GraphQL */ `
  query ListMemberships($teamId: String!, $queries: [String!], $search: String) {
    teamsListMemberships(teamId: $teamId, queries: $queries, search: $search) {
      total
      memberships {
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
  }
`)

/** The result returned by the {@link useTeamMemberships} hook. */
export type TeamMembershipsResult = Prettify<
  ResultOf<typeof listMemberships>['teamsListMemberships']
>

/**
 * Fetches the list of memberships for a team with optional query filters and search.
 *
 * @example
 * ```tsx
 * const { data, isLoading } = useTeamMemberships({
 *   teamId: 'engineering',
 *   queries: ['limit(25)'],
 * })
 *
 * // data.total, data.memberships
 * ```
 *
 * **Parameters:**
 * - `teamId` — The unique team identifier.
 * - `queries` *(optional)* — Appwrite query strings for filtering and pagination.
 * - `search` *(optional)* — A search term to filter memberships.
 *
 * @returns A `UseQueryResult` with the paginated membership list ({@link TeamMembershipsResult}).
 */
export function useTeamMemberships(
  {
    teamId,
    queries,
    search,
  }: {
    teamId: string
    queries?: string[]
    search?: string
  },
  opts: QueryOptions = {},
) {
  const { graphql } = useAppwrite()

  const queryResult = useQuery<TeamMembershipsResult, AppwriteException[], TeamMembershipsResult>({
    queryKey: [
      ...Keys.team(teamId).memberships().key(),
      ...(queries ?? []),
      ...(search ? [search] : []),
    ],
    queryFn: async () => {
      const { data, errors } = await graphql.query({
        query: listMemberships,
        variables: { teamId, queries, search },
      })

      if (errors) {
        throw errors
      }

      return data.teamsListMemberships
    },
    ...opts,
  })

  return queryResult
}
