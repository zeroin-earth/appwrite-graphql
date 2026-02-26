import { AppwriteException } from '../types'

import { gql } from '../__generated__'
import { ListTeamsQuery } from '../__generated__/graphql'
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

export function useTeams({
  queries,
  search,
}: {
  queries?: string[]
  search?: string
} = {}) {
  const { graphql } = useAppwrite()

  const queryResult = useQuery<
    ListTeamsQuery['teamsList'],
    AppwriteException[],
    ListTeamsQuery['teamsList']
  >({
    queryKey: ['appwrite', 'teams', { queries, search }],
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
  })

  return { ...queryResult }
}
