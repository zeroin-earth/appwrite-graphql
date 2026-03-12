import type { ResultOf, VariablesOf } from 'gql.tada'
import { graphql as gql } from 'gql.tada'

import { Keys } from '../query/Keys'
import type { AppwriteException } from '../types'
import { useAppwrite } from '../useAppwrite'
import { useMutation } from '../useMutation'
import { useQueryClient } from '../useQueryClient'

export const updateTeamPrefs = gql(/* GraphQL */ `
  mutation UpdateTeamPrefs($teamId: String!, $prefs: Assoc!) {
    teamsUpdatePrefs(teamId: $teamId, prefs: $prefs) {
      data
    }
  }
`)

type Variables = VariablesOf<typeof updateTeamPrefs>
type Result = ResultOf<typeof updateTeamPrefs>['teamsUpdatePrefs']

export function useUpdateTeamPrefs() {
  const { graphql } = useAppwrite()
  const queryClient = useQueryClient()

  const mutationResult = useMutation<Result, AppwriteException[], Variables>({
    mutationKey: Keys.teams().teamPrefs().update(),
    mutationFn: async ({ teamId, prefs }) => {
      const { data, errors } = await graphql.mutation({
        query: updateTeamPrefs,
        variables: { teamId, prefs },
      })

      if (errors) {
        throw errors
      }

      return data.teamsUpdatePrefs
    },
    onSuccess: (_, variables) => {
      void queryClient.invalidateQueries({ queryKey: Keys.team(variables.teamId).key() })
    },
  })

  return { ...mutationResult }
}
