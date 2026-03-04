import type { ResultOf, VariablesOf } from 'gql.tada'
import { graphql as gql } from 'gql.tada'

import { Keys } from '../query/Keys'
import type { AppwriteException } from '../types'
import { useAppwrite } from '../useAppwrite'
import { useMutation } from '../useMutation'

const createEmailVerification = gql(/* GraphQL */ `
  mutation CreateEmailVerification($url: String!) {
    accountCreateEmailVerification(url: $url) {
      _id
      userId
      secret
      expire
    }
  }
`)

type Variables = VariablesOf<typeof createEmailVerification>
type Result = ResultOf<typeof createEmailVerification>['accountCreateEmailVerification']

export function useCreateEmailVerification() {
  const { graphql } = useAppwrite()

  const queryResult = useMutation<Result, AppwriteException[], Variables>({
    mutationKey: Keys.account().emailVerification().create(),
    mutationFn: async ({ url }) => {
      const { data, errors } = await graphql.mutation({
        query: createEmailVerification,
        variables: { url },
      })

      if (errors) {
        throw errors
      }

      return data.accountCreateEmailVerification
    },
  })

  return { ...queryResult }
}
