import { gql } from '../__generated__'
import type { ListMembershipsQuery } from '../__generated__/graphql'
import type { AppwriteException } from '../types'
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

export function useTeamMemberships({
  teamId,
  queries,
  search,
}: {
  teamId: string
  queries?: string[]
  search?: string
}) {
  const { graphql } = useAppwrite()

  const queryResult = useQuery<
    ListMembershipsQuery['teamsListMemberships'],
    AppwriteException[],
    ListMembershipsQuery['teamsListMemberships']
  >({
    queryKey: ['appwrite', 'teams', teamId, 'memberships', { queries, search }],
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
  })

  return { ...queryResult }
}
