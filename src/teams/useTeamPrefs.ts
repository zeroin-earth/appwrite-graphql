import type { ResultOf, VariablesOf } from 'gql.tada'
import { graphql as gql } from 'gql.tada'

import { Keys } from '../query/Keys'
import type { AppwriteException, QueryOptions } from '../types'
import { useAppwrite } from '../useAppwrite'
import { useQuery } from '../useQuery'

const getTeamPrefs = gql(/* GraphQL */ `
  query GetTeamPrefs($teamId: String!) {
    teamsGetPrefs(teamId: $teamId) {
      data
    }
  }
`)

type Variables = VariablesOf<typeof getTeamPrefs>
type Result = ResultOf<typeof getTeamPrefs>['teamsGetPrefs']

export function useTeamPrefs({ teamId }: Variables, opts: QueryOptions = {}) {
  const { graphql } = useAppwrite()

  const queryResult = useQuery<Result, AppwriteException[], Result>({
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

  return { ...queryResult }
}
