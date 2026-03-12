import { graphql as gql } from 'gql.tada'

import type { AppwriteClient } from '../client'
import { Keys } from '../query/Keys'

export const getTeam = gql(/* GraphQL */ `
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

export function teamQueryOptions(client: AppwriteClient, { teamId }: { teamId: string }) {
  return {
    queryKey: Keys.team(teamId).key(),
    queryFn: async () => {
      const { data, errors } = await client.graphql.query({
        query: getTeam,
        variables: { teamId },
      })

      if (errors) {
        throw errors
      }

      return data.teamsGet
    },
  }
}
