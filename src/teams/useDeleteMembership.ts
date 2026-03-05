import type { ResultOf, VariablesOf } from 'gql.tada'
import { graphql as gql } from 'gql.tada'

import { Keys } from '../query/Keys'
import type { AppwriteException } from '../types'
import { useAppwrite } from '../useAppwrite'
import { useMutation } from '../useMutation'
import { useQueryClient } from '../useQueryClient'

export const deleteMembership = gql(/* GraphQL */ `
  mutation DeleteMembership($teamId: String!, $membershipId: String!) {
    teamsDeleteMembership(teamId: $teamId, membershipId: $membershipId) {
      status
    }
  }
`)

type Variables = VariablesOf<typeof deleteMembership>
type Result = ResultOf<typeof deleteMembership>['teamsDeleteMembership']

export function useDeleteMembership() {
  const { graphql } = useAppwrite()
  const queryClient = useQueryClient()

  const mutationResult = useMutation<Result, AppwriteException[], Variables>({
    mutationKey: Keys.teams().memberships().delete(),
    mutationFn: async ({ teamId, membershipId }) => {
      const { data, errors } = await graphql.mutation({
        query: deleteMembership,
        variables: { teamId, membershipId },
      })

      if (errors) {
        throw errors
      }

      return data?.teamsDeleteMembership ?? { status: '' }
    },
    onSuccess: (_, variables) => {
      queryClient.removeQueries({
        queryKey: Keys.team(variables.teamId).membership(variables.membershipId).key(),
      })
      void queryClient.invalidateQueries({
        queryKey: Keys.team(variables.teamId).memberships().key(),
      })
      void queryClient.invalidateQueries({ queryKey: Keys.team(variables.teamId).key() })
    },
  })

  return { ...mutationResult }
}
