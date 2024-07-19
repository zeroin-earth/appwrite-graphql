import { AppwriteException } from 'appwrite'

import { gql } from '../__generated__'
import { useAppwrite } from '../useAppwrite'
import { useQuery } from '../useQuery'
import { ListIdentitiesQuery } from '../__generated__/graphql'

const accountListIdentities = gql(/* GraphQL */ `
  query ListIdentities {
    accountListIdentities {
      total
      identities {
        ...Identity_Provider
      }
    }
  }
`)

export function useListIdentities() {
  const { graphql } = useAppwrite()

  const queryResult = useQuery<
    ListIdentitiesQuery['accountListIdentities'],
    AppwriteException[],
    void
  >({
    queryKey: ['appwrite', 'account', 'identities'],
    queryFn: async () => {
      const { data, errors } = await graphql.query({
        query: accountListIdentities,
      })

      if (errors) {
        throw errors
      }

      return data.accountListIdentities
    },
  })

  return { ...queryResult }
}
