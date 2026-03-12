import type { ResultOf, VariablesOf } from 'gql.tada'
import { graphql as gql } from 'gql.tada'

import { Keys } from '../query/Keys'
import type { AppwriteException } from '../types'
import { useAppwrite } from '../useAppwrite'
import { useMutation } from '../useMutation'

const createMagicURLToken = gql(/* GraphQL */ `
  mutation CreateMagicURLToken($userId: String!, $email: String!, $url: String, $phrase: Boolean) {
    accountCreateMagicURLToken(userId: $userId, email: $email, url: $url, phrase: $phrase) {
      expire
    }
  }
`)

type Variables = VariablesOf<typeof createMagicURLToken>
type Result = ResultOf<typeof createMagicURLToken>['accountCreateMagicURLToken']

export function useCreateMagicURLToken() {
  const { graphql } = useAppwrite()

  const queryResult = useMutation<Result, AppwriteException[], Variables>({
    mutationKey: Keys.account().magicUrl().create(),
    mutationFn: async ({ userId, email, url, phrase }) => {
      const { data, errors } = await graphql.mutation({
        query: createMagicURLToken,
        variables: {
          userId,
          email,
          url,
          phrase,
        },
      })

      if (errors) {
        throw errors
      }

      return data.accountCreateMagicURLToken
    },
  })

  return { ...queryResult }
}
