import { gql } from '../__generated__'
import type {
  UpdateMfaChallengeMutation,
  UpdateMfaChallengeMutationVariables,
} from '../__generated__/graphql'
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

export function useUpdateMfaChallenge() {
  const { graphql } = useAppwrite()

  const queryResult = useMutation<
    UpdateMfaChallengeMutation['accountUpdateMfaChallenge'],
    AppwriteException[],
    UpdateMfaChallengeMutationVariables
  >({
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
