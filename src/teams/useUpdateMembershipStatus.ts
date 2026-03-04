import type { ResultOf, VariablesOf } from 'gql.tada'
import { graphql as gql } from 'gql.tada'

import { Keys } from '../query/Keys'
import type { AppwriteException } from '../types'
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

type Variables = VariablesOf<typeof updateMembershipStatus>
type Result = ResultOf<typeof updateMembershipStatus>['teamsUpdateMembershipStatus']

export function useUpdateMembershipStatus() {
  const { graphql } = useAppwrite()
  const queryClient = useQueryClient()

  const mutationResult = useMutation<Result, AppwriteException[], Variables>({
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

  return { ...mutationResult }
}
