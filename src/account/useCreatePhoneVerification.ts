import type { ResultOf } from 'gql.tada'
import { graphql as gql } from 'gql.tada'

import { Keys } from '../query/Keys'
import type { AppwriteException } from '../types'
import { useAppwrite } from '../useAppwrite'
import { useMutation } from '../useMutation'

const createPhoneVerification = gql(/* GraphQL */ `
  mutation CreatePhoneVerification {
    accountCreatePhoneVerification {
      expire
    }
  }
`)

type Result = ResultOf<typeof createPhoneVerification>['accountCreatePhoneVerification']

export function useCreatePhoneVerification() {
  const { graphql } = useAppwrite()

  const queryResult = useMutation<Result, AppwriteException[], void>({
    mutationKey: Keys.account().phoneVerification().create(),
    mutationFn: async () => {
      const { data, errors } = await graphql.mutation({
        query: createPhoneVerification,
      })

      if (errors) {
        throw errors
      }

      return data.accountCreatePhoneVerification
    },
  })

  return { ...queryResult }
}
