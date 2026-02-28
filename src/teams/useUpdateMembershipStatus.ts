import { gql } from '../__generated__'
import type {
  UpdateMembershipStatusMutation,
  UpdateMembershipStatusMutationVariables,
} from '../__generated__/graphql'
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

export function useUpdateMembershipStatus() {
  const { graphql } = useAppwrite()
  const queryClient = useQueryClient()

  const mutationResult = useMutation<
    UpdateMembershipStatusMutation['teamsUpdateMembershipStatus'],
    AppwriteException[],
    UpdateMembershipStatusMutationVariables
  >({
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
        queryKey: ['appwrite', 'teams', variables.teamId, 'memberships'],
      })
    },
  })

  return { ...mutationResult }
}
