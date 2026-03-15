import { graphql as gql } from 'gql.tada'

import type { AppwriteClient } from '../client'
import { Keys } from '../query/Keys'

export const getAccount = gql(/* GraphQL */ `
  query AccountGet {
    accountGet {
      _id
      name
      email
      prefs {
        data
      }
    }
  }
`)

export function getAccountQuery(client: AppwriteClient) {
  return {
    queryKey: Keys.account().key(),
    queryFn: async () => {
      const { data, errors } = await client.graphql.query({
        query: getAccount,
      })

      if (errors) {
        throw errors
      }

      return data.accountGet
    },
    retry: false,
  }
}
