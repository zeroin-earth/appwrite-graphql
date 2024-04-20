import { UseMutationOptions } from '@tanstack/react-query'
import { AppwriteException } from 'appwrite'

import { gql } from '../__generated__'
import {
  UpdateMfaChallengeMutation,
  UpdateMfaChallengeMutationVariables,
} from '../__generated__/graphql'
import { useAppwrite } from '../useAppwrite'
import { useMutation } from '../useMutation'

const accountUpdateMfaChallenge = gql(/* GraphQL */ `
  mutation UpdateMfaChallenge($challengeId: String!, $otp: String!) {
    accountUpdateMfaChallenge(challengeId: $challengeId, otp: $otp) {
      status
    }
  }
`)

export function useUpdateMfaChallenge({
  options,
}: {
  options?: UseMutationOptions<
    UpdateMfaChallengeMutation['accountUpdateMfaChallenge'],
    AppwriteException,
    UpdateMfaChallengeMutationVariables,
    string[]
  >
}) {
  const { graphql } = useAppwrite()

  const queryResult = useMutation({
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

      return data.accountUpdateMfaChallenge
    },
    ...options,
  })

  return { ...queryResult }
}
