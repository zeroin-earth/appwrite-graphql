import type { ResultOf, VariablesOf } from 'gql.tada'

import type { getTeam } from './queryOptions'
import { teamQueryOptions } from './queryOptions'
import type { AppwriteException, Prettify, QueryOptions } from '../types'
import { useAppwrite } from '../useAppwrite'
import { useQuery } from '../useQuery'

/** The variables accepted by the {@link useTeam} hook. */
export type TeamVariables = Prettify<VariablesOf<typeof getTeam>>

/** The result returned by the {@link useTeam} hook. */
export type TeamResult = Prettify<ResultOf<typeof getTeam>['teamsGet']>

/**
 * Fetches a team by its unique identifier.
 *
 * @example
 * ```tsx
 * const { data, isLoading } = useTeam({
 *   teamId: 'engineering',
 * })
 *
 * // data.name, data.total, data._id
 * ```
 *
 * **Parameters** ({@link TeamVariables}):
 * - `teamId` — The unique team identifier.
 *
 * @returns A `UseQueryResult` with the team details ({@link TeamResult}).
 */
export function useTeam({ teamId }: TeamVariables, opts: QueryOptions = {}) {
  const client = useAppwrite()

  const queryResult = useQuery<TeamResult, AppwriteException[], TeamResult>({
    ...teamQueryOptions(client, { teamId }),
    ...opts,
  })

  return queryResult
}
