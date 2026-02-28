import { gql } from '../__generated__'
import type {
  CreateMembershipMutation,
  CreateMembershipMutationVariables,
} from '../__generated__/graphql'
import type { AppwriteException } from '../types'
import { useAppwrite } from '../useAppwrite'
import { useMutation } from '../useMutation'
import { useQueryClient } from '../useQueryClient'

const createMembership = gql(/* GraphQL */ `
  mutation CreateMembership(
    $teamId: String!
    $roles: [String!]!
    $email: String
    $userId: String
    $phone: String
    $url: String
    $name: String
  ) {
    teamsCreateMembership(
      teamId: $teamId
      roles: $roles
      email: $email
      userId: $userId
      phone: $phone
      url: $url
      name: $name
    ) {
      _id
      userId
      teamId
      roles
      confirm
    }
  }
`)

export function useCreateMembership() {
  const { graphql } = useAppwrite()
  const queryClient = useQueryClient()

  const mutationResult = useMutation<
    CreateMembershipMutation['teamsCreateMembership'],
    AppwriteException[],
    CreateMembershipMutationVariables
  >({
    mutationFn: async ({ teamId, roles, email, userId, phone, url, name }) => {
      const { data, errors } = await graphql.mutation({
        query: createMembership,
        variables: { teamId, roles, email, userId, phone, url, name },
      })

      if (errors) {
        throw errors
      }

      return data.teamsCreateMembership
    },
    onSuccess: (_, variables) => {
      void queryClient.invalidateQueries({
        queryKey: ['appwrite', 'teams', variables.teamId, 'memberships'],
      })
      void queryClient.invalidateQueries({ queryKey: ['appwrite', 'teams', variables.teamId] })
    },
  })

  return { ...mutationResult }
}
