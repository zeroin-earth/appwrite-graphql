import type { ResultOf, VariablesOf } from 'gql.tada'
import { graphql as gql } from 'gql.tada'

import { Keys } from '../query/Keys'
import type { AppwriteException } from '../types'
import { useAppwrite } from '../useAppwrite'
import { useMutation } from '../useMutation'
import { useQueryClient } from '../useQueryClient'

export const deleteTeam = gql(/* GraphQL */ `
  mutation DeleteTeam($teamId: String!) {
    teamsDelete(teamId: $teamId) {
      status
    }
  }
`)

type Variables = VariablesOf<typeof deleteTeam>
type Result = ResultOf<typeof deleteTeam>['teamsDelete']

export function useDeleteTeam() {
  const { graphql } = useAppwrite()
  const queryClient = useQueryClient()

  const mutationResult = useMutation<Result, AppwriteException[], Variables>({
    mutationKey: Keys.teams().delete(),
    mutationFn: async ({ teamId }) => {
      const { data, errors } = await graphql.mutation({
        query: deleteTeam,
        variables: { teamId },
      })

      if (errors) {
        throw errors
      }

      return data?.teamsDelete ?? { status: '' }
    },
    onSuccess: (_, variables) => {
      queryClient.removeQueries({ queryKey: Keys.team(variables.teamId).key() })
      void queryClient.invalidateQueries({ queryKey: Keys.teams().key() })
    },
  })

  return { ...mutationResult }
}
