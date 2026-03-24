import type { ResultOf, VariablesOf } from 'gql.tada'
import { graphql as gql } from 'gql.tada'

import { Keys } from '../query/Keys'
import type { AppwriteException, Prettify } from '../types'
import { useAppwrite } from '../useAppwrite'
import { useMutation } from '../useMutation'
import { useQueryClient } from '../useQueryClient'

const updateEmailVerification = gql(/* GraphQL */ `
  mutation UpdateEmailVerification($userId: String!, $secret: String!) {
    accountUpdateEmailVerification(userId: $userId, secret: $secret) {
      _id
      userId
      secret
      expire
    }
  }
`)

/** The variables accepted by the {@link useUpdateEmailVerification} mutation. */
export type UpdateEmailVerificationVariables = Prettify<VariablesOf<typeof updateEmailVerification>>
/** The result returned by the {@link useUpdateEmailVerification} mutation. */
export type UpdateEmailVerificationResult = Prettify<
  ResultOf<typeof updateEmailVerification>['accountUpdateEmailVerification']
>

/**
 * Mutation hook to confirm email verification using `userId` and `secret`.
 *
 * Completes the email verification flow started by
 * {@link useCreateEmailVerification}. The `userId` and `secret` are
 * provided in the verification URL query parameters. Invalidates account
 * queries on success.
 *
 * @example
 * ```tsx
 * const { mutate, isPending } = useUpdateEmailVerification()
 *
 * // Extract userId and secret from the verification URL
 * mutate({
 *   userId: 'user-123',
 *   secret: 'verification-secret',
 * })
 * ```
 *
 * **Variables** ({@link UpdateEmailVerificationVariables}):
 * - `userId` — The user's ID from the verification URL
 * - `secret` — The secret token from the verification URL
 *
 * @returns A `UseMutationResult` with the verification's `_id`, `userId`, `secret`, and `expire` fields.
 */
export function useUpdateEmailVerification() {
  const { graphql } = useAppwrite()
  const queryClient = useQueryClient()

  const queryResult = useMutation<
    UpdateEmailVerificationResult,
    AppwriteException[],
    UpdateEmailVerificationVariables
  >({
    mutationKey: Keys.account().emailVerification().update(),
    mutationFn: async ({ userId, secret }) => {
      const { data, errors } = await graphql.mutation({
        query: updateEmailVerification,
        variables: { userId, secret },
      })

      if (errors) {
        throw errors
      }

      return data.accountUpdateEmailVerification
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: Keys.account().key() })
    },
  })

  return queryResult
}
