import { gql } from '../__generated__'
import type { ListIdentitiesQuery } from '../__generated__/graphql'
import type { AppwriteException } from '../types'
import { useAppwrite } from '../useAppwrite'
import { useQuery } from '../useQuery'

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
    ListIdentitiesQuery['accountListIdentities']
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
