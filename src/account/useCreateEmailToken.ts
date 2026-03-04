import type { ResultOf, VariablesOf } from 'gql.tada'
import { graphql as gql } from 'gql.tada'

import { Keys } from '../query/Keys'
import type { AppwriteException } from '../types'
import { useAppwrite } from '../useAppwrite'
import { useMutation } from '../useMutation'

const createEmailToken = gql(/* GraphQL */ `
  mutation CreateEmailToken($userId: String!, $email: String!, $phrase: Boolean) {
    accountCreateEmailToken(userId: $userId, email: $email, phrase: $phrase) {
      expire
    }
  }
`)

type Variables = VariablesOf<typeof createEmailToken>
type Result = ResultOf<typeof createEmailToken>['accountCreateEmailToken']

export function useCreateEmailToken() {
  const { graphql } = useAppwrite()

  const queryResult = useMutation<Result, AppwriteException[], Variables>({
    mutationKey: Keys.account().emailToken().create(),
    mutationFn: async ({ userId, email, phrase }) => {
      const { data, errors } = await graphql.mutation({
        query: createEmailToken,
        variables: {
          userId,
          email,
          phrase,
        },
      })

      if (errors) {
        throw errors
      }

      return data.accountCreateEmailToken
    },
  })

  return { ...queryResult }
}
