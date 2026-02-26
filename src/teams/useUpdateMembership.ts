import { AppwriteException } from '../types'

import { gql } from '../__generated__'
import {
  UpdateMembershipMutation,
  UpdateMembershipMutationVariables,
} from '../__generated__/graphql'
import { useAppwrite } from '../useAppwrite'
import { useMutation } from '../useMutation'
import { useQueryClient } from '../useQueryClient'

const updateMembership = gql(/* GraphQL */ `
  mutation UpdateMembership($teamId: String!, $membershipId: String!, $roles: [String!]!) {
    teamsUpdateMembership(teamId: $teamId, membershipId: $membershipId, roles: $roles) {
      _id
      roles
    }
  }
`)

export function useUpdateMembership() {
  const { graphql } = useAppwrite()
  const queryClient = useQueryClient()

  const mutationResult = useMutation<
    UpdateMembershipMutation['teamsUpdateMembership'],
    AppwriteException[],
    UpdateMembershipMutationVariables
  >({
    mutationFn: async ({ teamId, membershipId, roles }) => {
      const { data, errors } = await graphql.mutation({
        query: updateMembership,
        variables: { teamId, membershipId, roles },
      })

      if (errors) {
        throw errors
      }

      return data.teamsUpdateMembership
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['appwrite', 'teams', variables.teamId, 'memberships'],
      })
    },
  })

  return { ...mutationResult }
}
