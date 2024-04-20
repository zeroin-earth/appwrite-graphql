import { UseQueryOptions } from '@tanstack/react-query'
import { AppwriteException } from 'appwrite'

import { gql } from '../__generated__'
import { useAppwrite } from '../useAppwrite'
import { useQuery } from '../useQuery'
import { ListIdentitiesQuery, ListIdentitiesQueryVariables } from '../__generated__/graphql'

type ListIdentitiesProps = {
  queries: string | string[]
}

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

export function useListIdentities({
  queries,
  options,
}: ListIdentitiesProps & {
  options?: UseQueryOptions<
    ListIdentitiesQuery['accountListIdentities'],
    AppwriteException,
    ListIdentitiesQueryVariables,
    string[]
  >
}) {
  const { graphql } = useAppwrite()

  const queryResult = useQuery({
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
    ...options,
  })

  return { ...queryResult }
}
