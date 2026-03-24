import type { ResultOf, VariablesOf } from 'gql.tada'
import { graphql as gql } from 'gql.tada'

import { Keys } from '../query/Keys'
import type { AppwriteException, Prettify } from '../types'
import { useAppwrite } from '../useAppwrite'
import { useMutation } from '../useMutation'

const updatePhoneVerification = gql(/* GraphQL */ `
  mutation UpdatePhoneVerification($userId: String!, $secret: String!) {
    accountUpdatePhoneVerification(userId: $userId, secret: $secret) {
      expire
    }
  }
`)

/** The variables accepted by the {@link useUpdatePhoneVerification} mutation. */
export type UpdatePhoneVerificationVariables = Prettify<VariablesOf<typeof updatePhoneVerification>>
/** The result returned by the {@link useUpdatePhoneVerification} mutation. */
export type UpdatePhoneVerificationResult = Prettify<
  ResultOf<typeof updatePhoneVerification>['accountUpdatePhoneVerification']
>

/**
 * Mutation hook to confirm phone verification using `userId` and `secret`.
 *
 * Completes the phone verification flow started by
 * {@link useCreatePhoneVerification}.
 *
 * @example
 * ```tsx
 * const { mutate, isPending } = useUpdatePhoneVerification()
 *
 * mutate({
 *   userId: 'user-123',
 *   secret: '123456',
 * })
 * ```
 *
 * **Variables** ({@link UpdatePhoneVerificationVariables}):
 * - `userId` — The user's ID
 * - `secret` — The verification code sent via SMS
 *
 * @returns A `UseMutationResult` with the verification's `expire` timestamp.
 */
export function useUpdatePhoneVerification() {
  const { graphql } = useAppwrite()

  const queryResult = useMutation<
    UpdatePhoneVerificationResult,
    AppwriteException[],
    UpdatePhoneVerificationVariables
  >({
    mutationKey: Keys.account().phoneVerification().update(),
    mutationFn: async ({ userId, secret }) => {
      const { data, errors } = await graphql.mutation({
        query: updatePhoneVerification,
        variables: {
          userId,
          secret,
        },
      })

      if (errors) {
        throw errors
      }

      return data.accountUpdatePhoneVerification
    },
  })

  return queryResult
}
