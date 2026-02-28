import { gql } from '../__generated__'
import type {
  UpdateTeamNameMutation,
  UpdateTeamNameMutationVariables,
} from '../__generated__/graphql'
import type { AppwriteException } from '../types'
import { useAppwrite } from '../useAppwrite'
import { useMutation } from '../useMutation'
import { useQueryClient } from '../useQueryClient'

const updateTeamName = gql(/* GraphQL */ `
  mutation UpdateTeamName($teamId: String!, $name: String!) {
    teamsUpdateName(teamId: $teamId, name: $name) {
      _id
      name
    }
  }
`)

export function useUpdateTeamName() {
  const { graphql } = useAppwrite()
  const queryClient = useQueryClient()

  const mutationResult = useMutation<
    UpdateTeamNameMutation['teamsUpdateName'],
    AppwriteException[],
    UpdateTeamNameMutationVariables
  >({
    mutationFn: async ({ teamId, name }) => {
      const { data, errors } = await graphql.mutation({
        query: updateTeamName,
        variables: { teamId, name },
      })

      if (errors) {
        throw errors
      }

      return data.teamsUpdateName
    },
    onSuccess: (_, variables) => {
      void queryClient.invalidateQueries({ queryKey: ['appwrite', 'teams', variables.teamId] })
      void queryClient.invalidateQueries({ queryKey: ['appwrite', 'teams'] })
    },
  })

  return { ...mutationResult }
}
