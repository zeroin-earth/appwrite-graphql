import { gql } from '../__generated__'
import type { CreateTeamMutation, CreateTeamMutationVariables } from '../__generated__/graphql'
import type { AppwriteException } from '../types'
import { useAppwrite } from '../useAppwrite'
import { useMutation } from '../useMutation'
import { useQueryClient } from '../useQueryClient'

const createTeam = gql(/* GraphQL */ `
  mutation CreateTeam($teamId: String!, $name: String!, $roles: [String!]) {
    teamsCreate(teamId: $teamId, name: $name, roles: $roles) {
      _id
      name
      total
    }
  }
`)

export function useCreateTeam() {
  const { graphql } = useAppwrite()
  const queryClient = useQueryClient()

  const mutationResult = useMutation<
    CreateTeamMutation['teamsCreate'],
    AppwriteException[],
    CreateTeamMutationVariables
  >({
    mutationFn: async ({ teamId, name, roles }) => {
      const { data, errors } = await graphql.mutation({
        query: createTeam,
        variables: { teamId, name, roles },
      })

      if (errors) {
        throw errors
      }

      return data.teamsCreate
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['appwrite', 'teams'] })
    },
  })

  return { ...mutationResult }
}
