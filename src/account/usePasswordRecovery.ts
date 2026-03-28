import type { ResultOf, VariablesOf } from 'gql.tada'
import { graphql as gql } from 'gql.tada'

import { Keys } from '../query/Keys'
import type { AppwriteException, Prettify } from '../types'
import { useAppwrite } from '../useAppwrite'
import { useMutation } from '../useMutation'

const createRecovery = gql(/* GraphQL */ `
  mutation CreateRecovery($email: String!, $url: String!) {
    accountCreateRecovery(email: $email, url: $url) {
      expire
    }
  }
`)

/** The variables accepted by the {@link usePasswordRecovery} mutation. */
export type PasswordRecoveryVariables = Prettify<VariablesOf<typeof createRecovery>>
/** The result returned by the {@link usePasswordRecovery} mutation. */
export type PasswordRecoveryResult = Prettify<
  ResultOf<typeof createRecovery>['accountCreateRecovery']
>

/**
 * Sends a password recovery email to the supplied address.
 *
 * Mutation hook to send a password recovery email. On success, stores
 * the email using the `kvStorage` adapter provided to `AppwriteProvider`
 * (falls back to `localStorage` on web). The recovery URL receives
 * `userId` and `secret` query parameters for use with
 * {@link useResetPassword}.
 *
 * @example
 * ```tsx
 * const { mutate, isPending } = usePasswordRecovery()
 *
 * mutate({
 *   email: 'user@example.com',
 *   url: 'https://example.com/reset-password',
 * })
 * ```
 *
 * **Variables** ({@link PasswordRecoveryVariables}):
 * - `email` — The email address to send the recovery link to
 * - `url` — The URL of the password reset page in your application
 *
 * @returns A `UseMutationResult` with the recovery token's `expire` timestamp.
 */
export function usePasswordRecovery() {
  const { graphql, kvStorage } = useAppwrite()

  const queryResult = useMutation<
    PasswordRecoveryResult,
    AppwriteException[],
    PasswordRecoveryVariables
  >({
    mutationKey: Keys.account().recovery().create(),
    mutationFn: async ({ email, url: resetUrl }) => {
      const { data, errors } = await graphql.mutation({
        query: createRecovery,
        variables: {
          email,
          url: resetUrl,
        },
      })

      if (errors) {
        throw errors
      }

      return data.accountCreateRecovery
    },
    onSuccess: async (_, variables) => {
      try {
        if (kvStorage) {
          await kvStorage.setItem('email', variables.email)
        } else if (typeof localStorage !== 'undefined') {
          localStorage.setItem('email', variables.email)
        }
      } catch {
        // Storage unavailable — non-critical, skip silently.
      }
    },
  })

  return queryResult
}
