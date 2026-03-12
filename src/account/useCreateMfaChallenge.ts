import type { ResultOf, VariablesOf } from 'gql.tada'
import { graphql as gql } from 'gql.tada'

import { Keys } from '../query/Keys'
import type { AppwriteException } from '../types'
import { useAppwrite } from '../useAppwrite'
import { useMutation } from '../useMutation'

const accountCreateMfaChallenge = gql(/* GraphQL */ `
  mutation CreateMfaChallenge($factor: String!) {
    accountCreateMfaChallenge(factor: $factor) {
      _id
      userId
      expire
    }
  }
`)

type Variables = VariablesOf<typeof accountCreateMfaChallenge>
type Result = ResultOf<typeof accountCreateMfaChallenge>['accountCreateMfaChallenge']

export function useCreateMfaChallenge() {
  const { graphql } = useAppwrite()

  const queryResult = useMutation<Result, AppwriteException[], Variables>({
    mutationKey: Keys.account().mfaChallenge().create(),
    mutationFn: async ({ factor }) => {
      const { data, errors } = await graphql.mutation({
        query: accountCreateMfaChallenge,
        variables: {
          factor,
        },
      })

      if (errors) {
        throw errors
      }

      return data.accountCreateMfaChallenge
    },
  })

  return { ...queryResult }
}
