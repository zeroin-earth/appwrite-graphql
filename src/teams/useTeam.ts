import type { ResultOf, VariablesOf } from 'gql.tada'
import { graphql as gql } from 'gql.tada'

import { Keys } from '../query/Keys'
import type { AppwriteException } from '../types'
import { useAppwrite } from '../useAppwrite'
import { useQuery } from '../useQuery'

const getTeam = gql(/* GraphQL */ `
  query GetTeam($teamId: String!) {
    teamsGet(teamId: $teamId) {
      _id
      _createdAt
      _updatedAt
      name
      total
      prefs {
        data
      }
    }
  }
`)

type Variables = VariablesOf<typeof getTeam>
type Result = ResultOf<typeof getTeam>['teamsGet']

export function useTeam({ teamId }: Variables) {
  const { graphql } = useAppwrite()

  const queryResult = useQuery<Result, AppwriteException[], Result>({
    queryKey: Keys.team(teamId).key(),
    queryFn: async () => {
      const { data, errors } = await graphql.query({
        query: getTeam,
        variables: { teamId },
      })

      if (errors) {
        throw errors
      }

      return data.teamsGet
    },
  })

  return { ...queryResult }
}
