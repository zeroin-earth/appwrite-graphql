import { gql } from '../__generated__'
import type { DeleteTeamMutation, DeleteTeamMutationVariables } from '../__generated__/graphql'
import type { AppwriteException } from '../types'
import { useAppwrite } from '../useAppwrite'
import { useMutation } from '../useMutation'
import { useQueryClient } from '../useQueryClient'

const deleteTeam = gql(/* GraphQL */ `
  mutation DeleteTeam($teamId: String!) {
    teamsDelete(teamId: $teamId) {
      status
    }
  }
`)

export function useDeleteTeam() {
  const { graphql } = useAppwrite()
  const queryClient = useQueryClient()

  const mutationResult = useMutation<
    DeleteTeamMutation['teamsDelete'],
    AppwriteException[],
    DeleteTeamMutationVariables
  >({
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
      queryClient.removeQueries({ queryKey: ['appwrite', 'teams', variables.teamId] })
      void queryClient.invalidateQueries({ queryKey: ['appwrite', 'teams'] })
    },
  })

  return { ...mutationResult }
}
