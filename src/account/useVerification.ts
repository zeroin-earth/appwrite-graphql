import type { ResultOf, VariablesOf } from 'gql.tada'
import { graphql as gql } from 'gql.tada'

import { Keys } from '../query/Keys'
import type { AppwriteException, Prettify } from '../types'
import { useAppwrite } from '../useAppwrite'
import { useMutation } from '../useMutation'
import { useQueryClient } from '../useQueryClient'

const updateVerification = gql(/* GraphQL */ `
  mutation UpdateVerification($userId: String!, $secret: String!) {
    accountUpdateVerification(userId: $userId, secret: $secret) {
      secret
      expire
      userId
    }
  }
`)

/** The variables accepted by the {@link useVerification} mutation. */
export type VerificationVariables = Prettify<VariablesOf<typeof updateVerification>>
/** The result returned by the {@link useVerification} mutation. */
export type VerificationResult = Prettify<
  ResultOf<typeof updateVerification>['accountUpdateVerification']
>

/**
 * Mutation hook to complete email verification using `userId` and `secret` from the verification link.
 *
 * Validates the verification token and marks the user's email as verified.
 * Throws an error if `userId` or `secret` is missing. On success, sets the
 * account query data to `null` to force a re-fetch.
 *
 * @example
 * ```tsx
 * const { mutate, isPending } = useVerification()
 *
 * // Extract userId and secret from the verification URL
 * mutate({
 *   userId: 'user-123',
 *   secret: 'verification-secret',
 * })
 * ```
 *
 * **Variables** ({@link VerificationVariables}):
 * - `userId` — The user's ID from the verification URL
 * - `secret` — The secret token from the verification URL
 *
 * @returns A `UseMutationResult` with the verification's `secret`, `expire`, and `userId` fields.
 */
export function useVerification() {
  const { graphql } = useAppwrite()
  const queryClient = useQueryClient()

  const queryResult = useMutation<VerificationResult, AppwriteException[], VerificationVariables>({
    mutationKey: Keys.account().verification().update(),
    mutationFn: async ({ userId, secret }) => {
      if (!userId || !secret) {
        throw new Error('Missing userId or secret')
      }

      const { data, errors } = await graphql.mutation({
        query: updateVerification,
        variables: {
          userId,
          secret,
        },
      })

      if (errors) {
        throw errors
      }

      return data.accountUpdateVerification
    },
    onSuccess: async () => {
      queryClient.setQueryData(Keys.account().key(), null)
    },
  })

  return queryResult
}
