import type { ResultOf } from 'gql.tada'
import { graphql as gql } from 'gql.tada'

import { Identity_Provider } from './fragments'
import { Keys } from '../query/Keys'
import type { AppwriteException } from '../types'
import { useAppwrite } from '../useAppwrite'
import { useQuery } from '../useQuery'

const accountListIdentities = gql(
  /* GraphQL */ `
    query ListIdentities {
      accountListIdentities {
        total
        identities {
          ...Identity_Provider
        }
      }
    }
  `,
  [Identity_Provider],
)

type Result = ResultOf<typeof accountListIdentities>['accountListIdentities']

export function useListIdentities() {
  const { graphql } = useAppwrite()

  const queryResult = useQuery<Result, AppwriteException[], Result>({
    queryKey: Keys.account().identities(),
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
