import { AppwriteException } from '../types'

import { gql } from '../__generated__'
import {
  DeleteMembershipMutation,
  DeleteMembershipMutationVariables,
} from '../__generated__/graphql'
import { useAppwrite } from '../useAppwrite'
import { useMutation } from '../useMutation'
import { useQueryClient } from '../useQueryClient'

const deleteMembership = gql(/* GraphQL */ `
  mutation DeleteMembership($teamId: String!, $membershipId: String!) {
    teamsDeleteMembership(teamId: $teamId, membershipId: $membershipId) {
      status
    }
  }
`)

export function useDeleteMembership() {
  const { graphql } = useAppwrite()
  const queryClient = useQueryClient()

  const mutationResult = useMutation<
    DeleteMembershipMutation['teamsDeleteMembership'],
    AppwriteException[],
    DeleteMembershipMutationVariables
  >({
    mutationFn: async ({ teamId, membershipId }) => {
      const { data, errors } = await graphql.mutation({
        query: deleteMembership,
        variables: { teamId, membershipId },
      })

      if (errors) {
        throw errors
      }

      return data?.teamsDeleteMembership ?? { status: true }
    },
    onSuccess: (_, variables) => {
      queryClient.removeQueries({
        queryKey: ['appwrite', 'teams', variables.teamId, 'memberships', variables.membershipId],
      })
      queryClient.invalidateQueries({
        queryKey: ['appwrite', 'teams', variables.teamId, 'memberships'],
      })
      queryClient.invalidateQueries({ queryKey: ['appwrite', 'teams', variables.teamId] })
    },
  })

  return { ...mutationResult }
}
