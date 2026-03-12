import type { ResultOf, VariablesOf } from 'gql.tada'

import type { getTeam } from './queryOptions'
import { teamQueryOptions } from './queryOptions'
import type { AppwriteException, QueryOptions } from '../types'
import { useAppwrite } from '../useAppwrite'
import { useQuery } from '../useQuery'

type Variables = VariablesOf<typeof getTeam>
type Result = ResultOf<typeof getTeam>['teamsGet']

export function useTeam({ teamId }: Variables, opts: QueryOptions = {}) {
  const client = useAppwrite()

  const queryResult = useQuery<Result, AppwriteException[], Result>({
    ...teamQueryOptions(client, { teamId }),
    ...opts,
  })

  return { ...queryResult }
}
