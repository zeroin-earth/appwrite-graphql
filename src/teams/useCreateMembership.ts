import type { ResultOf, VariablesOf } from 'gql.tada'
import { graphql as gql } from 'gql.tada'

import { Keys } from '../query/Keys'
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

type Variables = VariablesOf<typeof createMembership>
type Result = ResultOf<typeof createMembership>['teamsCreateMembership']

export function useCreateMembership() {
  const { graphql } = useAppwrite()
  const queryClient = useQueryClient()

  const mutationResult = useMutation<Result, AppwriteException[], Variables>({
    mutationKey: Keys.teams().memberships().create(),
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
        queryKey: Keys.team(variables.teamId).memberships().key(),
      })
      void queryClient.invalidateQueries({ queryKey: Keys.team(variables.teamId).key() })
    },
  })

  return { ...mutationResult }
}
