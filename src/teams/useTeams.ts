import type { ResultOf } from 'gql.tada'
import { graphql as gql } from 'gql.tada'

import { Keys } from '../query/Keys'
import type { AppwriteException, Prettify, QueryOptions } from '../types'
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

/** The result returned by the {@link useTeams} hook. */
export type TeamsResult = Prettify<ResultOf<typeof listTeams>['teamsList']>

/**
 * Fetches a list of teams the current user belongs to.
 *
 * @example
 * ```tsx
 * const { data, isLoading } = useTeams()
 *
 * // data.total, data.teams
 * ```
 *
 * **Parameters** *(all optional)*:
 * - `queries` — Appwrite query strings for filtering and pagination.
 * - `search` — A search term to filter teams by name.
 *
 * @returns A `UseQueryResult` with the paginated team list ({@link TeamsResult}).
 */
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

  const queryResult = useQuery<TeamsResult, AppwriteException[], TeamsResult>({
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

  return queryResult
}
