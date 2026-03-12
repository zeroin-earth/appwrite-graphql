import type { ResultOf, VariablesOf } from 'gql.tada'
import { graphql as gql } from 'gql.tada'

import { Keys } from '../query/Keys'
import type { AppwriteException } from '../types'
import { useAppwrite } from '../useAppwrite'
import { useMutation } from '../useMutation'

const createPhoneToken = gql(/* GraphQL */ `
  mutation CreatePhoneToken($userId: String!, $phone: String!) {
    accountCreatePhoneToken(userId: $userId, phone: $phone) {
      expire
    }
  }
`)

type Variables = VariablesOf<typeof createPhoneToken>
type Result = ResultOf<typeof createPhoneToken>['accountCreatePhoneToken']

export function useCreatePhoneToken() {
  const { graphql } = useAppwrite()

  const queryResult = useMutation<Result, AppwriteException[], Variables>({
    mutationKey: Keys.account().phoneToken().create(),
    mutationFn: async ({ userId, phone }) => {
      const { data, errors } = await graphql.mutation({
        query: createPhoneToken,
        variables: {
          userId,
          phone,
        },
      })

      if (errors) {
        throw errors
      }

      return data.accountCreatePhoneToken
    },
  })

  return { ...queryResult }
}
