import type { ResultOf, VariablesOf } from 'gql.tada'
import { graphql as gql } from 'gql.tada'

import { Keys } from '../query/Keys'
import type { AppwriteException, Prettify } from '../types'
import { useAppwrite } from '../useAppwrite'
import { useMutation } from '../useMutation'

const updateRecovery = gql(/* GraphQL */ `
  mutation UpdateRecovery($userId: String!, $secret: String!, $password: String!) {
    accountUpdateRecovery(userId: $userId, secret: $secret, password: $password) {
      expire
    }
  }
`)

/** The variables accepted by the {@link useResetPassword} mutation. */
export type ResetPasswordVariables = Prettify<VariablesOf<typeof updateRecovery>>
/** The result returned by the {@link useResetPassword} mutation. */
export type ResetPasswordResult = Prettify<ResultOf<typeof updateRecovery>['accountUpdateRecovery']>

/**
 * Mutation hook to reset a password using the recovery `userId`, `secret`, and new `password`.
 *
 * Completes the password recovery flow started by {@link usePasswordRecovery}.
 * The `userId` and `secret` are provided in the recovery URL query parameters.
 *
 * @example
 * ```tsx
 * const { mutate, isPending } = useResetPassword()
 *
 * mutate({
 *   userId: 'user-123',
 *   secret: 'recovery-secret',
 *   password: 'new-secure-password',
 * })
 * ```
 *
 * **Variables** ({@link ResetPasswordVariables}):
 * - `userId` — The user's ID from the recovery URL
 * - `secret` — The secret token from the recovery URL
 * - `password` — The new password to set
 *
 * @returns A `UseMutationResult` with the recovery token's `expire` timestamp.
 */
export function useResetPassword() {
  const { graphql } = useAppwrite()

  const queryResult = useMutation<ResetPasswordResult, AppwriteException[], ResetPasswordVariables>(
    {
      mutationKey: Keys.account().recovery().update(),
      mutationFn: async ({ userId, secret, password }) => {
        const { data, errors } = await graphql.mutation({
          query: updateRecovery,
          variables: {
            userId,
            secret,
            password,
          },
        })

        if (errors) {
          throw errors
        }

        return data.accountUpdateRecovery
      },
    },
  )

  return queryResult
}
