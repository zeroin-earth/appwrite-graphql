import { AppwriteException } from 'appwrite'

import { gql } from '../__generated__'
import { useAppwrite } from '../useAppwrite'
import { useQuery } from '../useQuery'
import { ListIdentitiesQuery, ListIdentitiesQueryVariables } from '../__generated__/graphql'

const accountListIdentities = gql(/* GraphQL */ `
  query ListIdentities($queries: [String!]) {
    accountListIdentities(queries: $queries) {
      total
      identities {
        ...Identity_ProviderFragment
      }
    }
  }
`)

export function useListIdentities({ queries }: ListIdentitiesQueryVariables) {
  const { graphql } = useAppwrite()

  const queryResult = useQuery<
    ListIdentitiesQuery['accountListIdentities'],
    AppwriteException,
    ListIdentitiesQuery['accountListIdentities']
  >({
    queryKey: ['appwrite', 'account', 'identities', queries],
    queryFn: async () => {
      const { data, errors } = await graphql.query({
        query: accountListIdentities,
        variables: {
          queries,
        },
      })

      if (errors) {
        throw errors
      }

      return data.accountListIdentities
    },
  })

  return { ...queryResult }
}
