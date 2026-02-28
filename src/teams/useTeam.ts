import { gql } from '../__generated__'
import type { GetTeamQuery, GetTeamQueryVariables } from '../__generated__/graphql'
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

export function useTeam({ teamId }: GetTeamQueryVariables) {
  const { graphql } = useAppwrite()

  const queryResult = useQuery<
    GetTeamQuery['teamsGet'],
    AppwriteException[],
    GetTeamQuery['teamsGet']
  >({
    queryKey: ['appwrite', 'teams', teamId],
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
