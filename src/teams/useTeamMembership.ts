import { AppwriteException } from '../types'

import { gql } from '../__generated__'
import { GetMembershipQuery, GetMembershipQueryVariables } from '../__generated__/graphql'
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

export function useTeamMembership({ teamId, membershipId }: GetMembershipQueryVariables) {
  const { graphql } = useAppwrite()

  const queryResult = useQuery<
    GetMembershipQuery['teamsGetMembership'],
    AppwriteException[],
    GetMembershipQuery['teamsGetMembership']
  >({
    queryKey: ['appwrite', 'teams', teamId, 'memberships', membershipId],
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
  })

  return { ...queryResult }
}
