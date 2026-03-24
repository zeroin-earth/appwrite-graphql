import type { ResultOf, VariablesOf } from 'gql.tada'
import { graphql as gql } from 'gql.tada'

import { Keys } from '../query/Keys'
import type { AppwriteException, Prettify } from '../types'
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

/** The variables accepted by the {@link useCreateTeam} hook. */
export type CreateTeamVariables = Prettify<VariablesOf<typeof createTeam>>

/** The result returned by the {@link useCreateTeam} hook. */
export type CreateTeamResult = Prettify<ResultOf<typeof createTeam>['teamsCreate']>

/**
 * Mutation to create a new team.
 *
 * Sends the `CreateTeam` GraphQL mutation and invalidates the team list cache on success.
 *
 * @example
 * ```tsx
 * const { mutate, isPending } = useCreateTeam()
 *
 * mutate({
 *   teamId: ID.unique(),
 *   name: 'Engineering',
 *   roles: ['owner', 'developer'],
 * })
 * ```
 *
 * **Variables** ({@link CreateTeamVariables}):
 * - `teamId` — A unique ID for the new team (use `ID.unique()` to auto-generate)
 * - `name` — The display name of the team
 * - `roles` — Optional. An array of roles assigned to the team creator
 *
 * @returns A `UseMutationResult` whose `data` is the created {@link CreateTeamResult} with `_id`, `name`, and `total`.
 */
export function useCreateTeam() {
  const { graphql } = useAppwrite()
  const queryClient = useQueryClient()

  const mutationResult = useMutation<CreateTeamResult, AppwriteException[], CreateTeamVariables>({
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

  return mutationResult
}
