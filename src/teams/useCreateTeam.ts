import type { ResultOf, VariablesOf } from 'gql.tada'
import { graphql as gql } from 'gql.tada'

import { Keys } from '../query/Keys'
import type { AppwriteException } from '../types'
import { useAppwrite } from '../useAppwrite'
import { useMutation } from '../useMutation'
import { useQueryClient } from '../useQueryClient'

export const createTeam = gql(/* GraphQL */ `
  mutation CreateTeam($teamId: String!, $name: String!, $roles: [String!]) {
    teamsCreate(teamId: $teamId, name: $name, roles: $roles) {
      _id
      name
      total
    }
  }
`)

type Variables = VariablesOf<typeof createTeam>
type Result = ResultOf<typeof createTeam>['teamsCreate']

export function useCreateTeam() {
  const { graphql } = useAppwrite()
  const queryClient = useQueryClient()

  const mutationResult = useMutation<Result, AppwriteException[], Variables>({
    mutationKey: Keys.teams().create(),
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
      void queryClient.invalidateQueries({ queryKey: Keys.teams().key() })
    },
  })

  return { ...mutationResult }
}
