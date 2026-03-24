import type { ResultOf, VariablesOf } from 'gql.tada'
import { graphql as gql } from 'gql.tada'

import { Keys } from '../query/Keys'
import type { AppwriteException, Prettify, QueryOptions } from '../types'
import { useAppwrite } from '../useAppwrite'
import { useQuery } from '../useQuery'

const getTeamPrefs = gql(/* GraphQL */ `
  query GetTeamPrefs($teamId: String!) {
    teamsGetPrefs(teamId: $teamId) {
      data
    }
  }
`)

/** The variables accepted by the {@link useTeamPrefs} hook. */
export type TeamPrefsVariables = Prettify<VariablesOf<typeof getTeamPrefs>>

/** The result returned by the {@link useTeamPrefs} hook. */
export type TeamPrefsResult = Prettify<ResultOf<typeof getTeamPrefs>['teamsGetPrefs']>

/**
 * Fetches the preferences for a specific team.
 *
 * @example
 * ```tsx
 * const { data, isLoading } = useTeamPrefs({
 *   teamId: 'engineering',
 * })
 *
 * // data.data — the team's preference payload
 * ```
 *
 * **Parameters** ({@link TeamPrefsVariables}):
 * - `teamId` — The unique team identifier.
 *
 * @returns A `UseQueryResult` with the team preferences ({@link TeamPrefsResult}).
 */
export function useTeamPrefs({ teamId }: TeamPrefsVariables, opts: QueryOptions = {}) {
  const { graphql } = useAppwrite()

  const queryResult = useQuery<TeamPrefsResult, AppwriteException[], TeamPrefsResult>({
    queryKey: Keys.team(teamId).teamPrefs().key(),
    queryFn: async () => {
      const { data, errors } = await graphql.query({
        query: getTeamPrefs,
        variables: { teamId },
      })

      if (errors) {
        throw errors
      }

      return data.teamsGetPrefs
    },
    ...opts,
  })

  return queryResult
}
