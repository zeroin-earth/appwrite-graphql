import type { ResultOf, VariablesOf } from 'gql.tada'
import { graphql as gql } from 'gql.tada'

import { Keys } from '../query/Keys'
import type { AppwriteException } from '../types'
import { useAppwrite } from '../useAppwrite'
import { useMutation } from '../useMutation'
import { useQueryClient } from '../useQueryClient'

const updateMFAAuthenticator = gql(/* GraphQL */ `
  mutation UpdateMfaAuthenticator($type: String!, $otp: String!) {
    accountUpdateMfaAuthenticator(type: $type, otp: $otp) {
      mfa
    }
  }
`)

type Variables = VariablesOf<typeof updateMFAAuthenticator>
type Result = ResultOf<typeof updateMFAAuthenticator>['accountUpdateMfaAuthenticator']

export function useUpdateMfaAuthenticator() {
  const { graphql } = useAppwrite()
  const queryClient = useQueryClient()

  const queryResult = useMutation<Result, AppwriteException[], Variables>({
    mutationKey: Keys.account().mfaAuthenticator().update(),
    mutationFn: async ({ type = 'totp', otp }) => {
      const { data, errors } = await graphql.mutation({
        query: updateMFAAuthenticator,
        variables: {
          type,
          otp,
        },
      })

      if (errors) {
        throw errors
      }

      return data.accountUpdateMfaAuthenticator
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: Keys.account().key() })
      void queryClient.invalidateQueries({ queryKey: Keys.account().mfaFactors() })
    },
  })

  return { ...queryResult }
}
