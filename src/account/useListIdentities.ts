import { Models } from 'appwrite'

import { gql } from '../__generated__'
import { useAppwrite } from '../useAppwrite'
import { useMutation } from '../useMutation'

type ListIdentitiesProps = {
  queries: Array<string>
}

const accountListIdentities = gql(/* GraphQL */ `
  query ListIdentities($queries: [String!]) {
    accountListIdentities(queries: $queries) {
      total
      identities {
        userId
        provider
        providerUid
        providerEmail
        providerAccessToken
        providerAccessTokenExpiry
        providerRefreshToken
      }
    }
  }
`)

export function useListIdentities() {
  const { graphql } = useAppwrite()

  const listIdentities = useMutation<Models.IdentityList, Error, ListIdentitiesProps, unknown>({
    mutationFn: async ({ queries }) => {
      const { data, errors } = await graphql.query({
        query: accountListIdentities,
        variables: {
          queries,
        },
      })

      if (errors) {
        throw errors
      }

      return {
        ...data.accountListIdentities,
        identities:
          (data.accountListIdentities.identities as Array<Models.Identity>) ??
          ([] as Array<Models.Identity>),
      }
    },
  })

  return { listIdentities }
}
