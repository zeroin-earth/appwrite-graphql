import type { ResultOf, VariablesOf } from 'gql.tada'
import { graphql as gql } from 'gql.tada'

import { Keys } from '../query/Keys'
import type { AppwriteException } from '../types'
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

type Variables = VariablesOf<typeof updateMembership>
type Result = ResultOf<typeof updateMembership>['teamsUpdateMembership']

export function useUpdateMembership() {
  const { graphql } = useAppwrite()
  const queryClient = useQueryClient()

  const mutationResult = useMutation<Result, AppwriteException[], Variables>({
    mutationKey: Keys.teams().memberships().update(),
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
      void queryClient.invalidateQueries({
        queryKey: Keys.team(variables.teamId).memberships().key(),
      })
    },
  })

  return { ...mutationResult }
}
