import type { ResultOf, VariablesOf } from 'gql.tada'
import { graphql as gql } from 'gql.tada'

import { Keys } from '../query/Keys'
import type { AppwriteException } from '../types'
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

type Variables = VariablesOf<typeof getMembership>
type Result = ResultOf<typeof getMembership>['teamsGetMembership']

export function useTeamMembership({ teamId, membershipId }: Variables) {
  const { graphql } = useAppwrite()

  const queryResult = useQuery<Result, AppwriteException[], Result>({
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
  })

  return { ...queryResult }
}
