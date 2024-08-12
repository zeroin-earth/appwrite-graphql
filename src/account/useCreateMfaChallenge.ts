import { AppwriteException } from '../types'

import { gql } from '../__generated__'
import { CreateMfaChallengeMutation } from '../__generated__/graphql'
import { useAppwrite } from '../useAppwrite'
import { useMutation } from '../useMutation'

const accountCreateMfaChallenge = gql(/* GraphQL */ `
  mutation CreateMfaChallenge($factor: String!) {
    accountCreateMfaChallenge(factor: $factor) {
      userId
      expire
    }
  }
`)

export function useCreateMfaChallenge() {
  const { graphql } = useAppwrite()

  const queryResult = useMutation<
    CreateMfaChallengeMutation['accountCreateMfaChallenge'],
    AppwriteException[],
    { factor: 'email' | 'phone' | 'totp' | 'recoveryCode' }
  >({
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
