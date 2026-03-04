import type { ResultOf, VariablesOf } from 'gql.tada'
import { graphql as gql } from 'gql.tada'

import { Keys } from '../query/Keys'
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

type Variables = VariablesOf<typeof updateTeamName>
type Result = ResultOf<typeof updateTeamName>['teamsUpdateName']

export function useUpdateTeamName() {
  const { graphql } = useAppwrite()
  const queryClient = useQueryClient()

  const mutationResult = useMutation<Result, AppwriteException[], Variables>({
    mutationKey: Keys.teams().teamName().update(),
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
      void queryClient.invalidateQueries({ queryKey: Keys.team(variables.teamId).key() })
      void queryClient.invalidateQueries({ queryKey: Keys.teams().key() })
    },
  })

  return { ...mutationResult }
}
