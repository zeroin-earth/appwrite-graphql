import { gql } from '../__generated__'
import type { GetTeamPrefsQuery, GetTeamPrefsQueryVariables } from '../__generated__/graphql'
import type { AppwriteException } from '../types'
import { useAppwrite } from '../useAppwrite'
import { useQuery } from '../useQuery'

const getTeamPrefs = gql(/* GraphQL */ `
  query GetTeamPrefs($teamId: String!) {
    teamsGetPrefs(teamId: $teamId) {
      data
    }
  }
`)

export function useTeamPrefs({ teamId }: GetTeamPrefsQueryVariables) {
  const { graphql } = useAppwrite()

  const queryResult = useQuery<
    GetTeamPrefsQuery['teamsGetPrefs'],
    AppwriteException[],
    GetTeamPrefsQuery['teamsGetPrefs']
  >({
    queryKey: ['appwrite', 'teams', teamId, 'prefs'],
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
  })

  return { ...queryResult }
}
