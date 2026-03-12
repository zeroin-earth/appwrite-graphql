import type { ResultOf } from 'gql.tada'
import { graphql as gql } from 'gql.tada'

import { Keys } from '../query/Keys'
import type { AppwriteException, QueryOptions } from '../types'
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

type Result = ResultOf<typeof listMemberships>['teamsListMemberships']

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

  const queryResult = useQuery<Result, AppwriteException[], Result>({
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

  return { ...queryResult }
}
