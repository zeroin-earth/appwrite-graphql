import type { ResultOf, VariablesOf } from 'gql.tada'
import { graphql as gql } from 'gql.tada'

import { Keys } from '../query/Keys'
import type { AppwriteException } from '../types'
import { useAppwrite } from '../useAppwrite'
import { useMutation } from '../useMutation'

const accountUpdateMfaChallenge = gql(/* GraphQL */ `
  mutation UpdateMfaChallenge($challengeId: String!, $otp: String!) {
    accountUpdateMfaChallenge(challengeId: $challengeId, otp: $otp) {
      _id
      userId
      expire
      current
    }
  }
`)

type Variables = VariablesOf<typeof accountUpdateMfaChallenge>
type Result = ResultOf<typeof accountUpdateMfaChallenge>['accountUpdateMfaChallenge']

export function useUpdateMfaChallenge() {
  const { graphql } = useAppwrite()

  const queryResult = useMutation<Result, AppwriteException[], Variables>({
    mutationKey: Keys.account().mfaChallenge().update(),
    mutationFn: async ({ challengeId, otp }) => {
      const { data, errors } = await graphql.mutation({
        query: accountUpdateMfaChallenge,
        variables: {
          challengeId,
          otp,
        },
      })

      if (errors) {
        throw errors
      }

      return data?.accountUpdateMfaChallenge ?? null
    },
  })

  return { ...queryResult }
}
