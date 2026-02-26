import { AppwriteException } from '../types'

import { gql } from '../__generated__'
import { UpdateTeamPrefsMutation, UpdateTeamPrefsMutationVariables } from '../__generated__/graphql'
import { useAppwrite } from '../useAppwrite'
import { useMutation } from '../useMutation'
import { useQueryClient } from '../useQueryClient'

const updateTeamPrefs = gql(/* GraphQL */ `
  mutation UpdateTeamPrefs($teamId: String!, $prefs: Assoc!) {
    teamsUpdatePrefs(teamId: $teamId, prefs: $prefs) {
      data
    }
  }
`)

export function useUpdateTeamPrefs() {
  const { graphql } = useAppwrite()
  const queryClient = useQueryClient()

  const mutationResult = useMutation<
    UpdateTeamPrefsMutation['teamsUpdatePrefs'],
    AppwriteException[],
    UpdateTeamPrefsMutationVariables
  >({
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
      queryClient.invalidateQueries({ queryKey: ['appwrite', 'teams', variables.teamId] })
    },
  })

  return { ...mutationResult }
}
