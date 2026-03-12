import type { ResultOf } from 'gql.tada'
import { graphql as gql } from 'gql.tada'

import { Keys } from '../query/Keys'
import type { AppwriteException, QueryOptions } from '../types'
import { useAppwrite } from '../useAppwrite'
import { useQuery } from '../useQuery'

const listTeams = gql(/* GraphQL */ `
  query ListTeams($queries: [String!], $search: String) {
    teamsList(queries: $queries, search: $search) {
      total
      teams {
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
  }
`)

type Result = ResultOf<typeof listTeams>['teamsList']

export function useTeams(
  {
    queries,
    search,
  }: {
    queries?: string[]
    search?: string
  } = {},
  opts: QueryOptions = {},
) {
  const { graphql } = useAppwrite()

  const queryResult = useQuery<Result, AppwriteException[], Result>({
    queryKey: [...Keys.teams().key(), ...(queries ?? []), ...(search ? [search] : [])],
    queryFn: async () => {
      const { data, errors } = await graphql.query({
        query: listTeams,
        variables: { queries, search },
      })

      if (errors) {
        throw errors
      }

      return data.teamsList
    },
    ...opts,
  })

  return { ...queryResult }
}
