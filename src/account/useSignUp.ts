import type { ResultOf, VariablesOf } from 'gql.tada'
import { graphql as gql } from 'gql.tada'

import { Keys } from '../query/Keys'
import type { AppwriteException, Prettify } from '../types'
import { ID } from '../types'
import { useAppwrite } from '../useAppwrite'
import { useMutation } from '../useMutation'

const createAccount = gql(/* GraphQL */ `
  mutation CreateAccount($userId: String!, $name: String, $email: String!, $password: String!) {
    accountCreate(userId: $userId, name: $name, email: $email, password: $password) {
      name
      email
    }
  }
`)

const verify = gql(/* GraphQL */ `
  mutation VerifyEmail($url: String!) {
    accountCreateVerification(url: $url) {
      expire
    }
  }
`)

/** The variables accepted by the {@link useSignUp} mutation. */
export type SignUpVariables = Prettify<
  Omit<VariablesOf<typeof createAccount>, 'userId'> & {
    userId?: string
  }
>
/** The result returned by the {@link useSignUp} mutation. */
export type SignUpResult = Prettify<ResultOf<typeof createAccount>['accountCreate']>

/** The variables accepted by the verify email mutation in {@link useSignUp}. */
export type VerifyEmailVariables = {
  verifyUrl: string
}
/** The result returned by the verify email mutation in {@link useSignUp}. */
export type VerifyEmailResult = Prettify<ResultOf<typeof verify>['accountCreateVerification']>

/**
 * Returns `signUp` and `verifyEmail` mutations.
 *
 * `signUp` creates a new account with email/password. `verifyEmail` sends
 * a verification email to the newly created account. A `userId` is
 * auto-generated via `ID.unique()` if not provided.
 *
 * @example
 * ```tsx
 * const { signUp, verifyEmail } = useSignUp()
 *
 * // Create a new account
 * signUp.mutate({
 *   email: 'user@example.com',
 *   password: 'secure-password',
 *   name: 'Jane Doe',
 * })
 * ```
 *
 * @example
 * ```tsx
 * const { signUp, verifyEmail } = useSignUp()
 *
 * // Send a verification email after sign-up
 * verifyEmail.mutate({
 *   verifyUrl: 'https://example.com/verify-email',
 * })
 * ```
 *
 * **`signUp` variables** ({@link SignUpVariables}):
 * - `email` — The user's email address
 * - `password` — The user's password
 * - `name` — Optional. The user's display name
 * - `userId` — Optional. Custom user ID (auto-generated if omitted)
 *
 * **`verifyEmail` variables** ({@link VerifyEmailVariables}):
 * - `verifyUrl` — The URL to redirect the user to after clicking the verification link
 *
 * @returns An object with `signUp` (`UseMutationResult` with the account's `name` and `email`) and `verifyEmail` (`UseMutationResult` with the verification token's `expire` timestamp).
 */
export function useSignUp() {
  const { graphql } = useAppwrite()

  const signUp = useMutation<SignUpResult, AppwriteException[], SignUpVariables>({
    mutationKey: Keys.account().signUp().create(),
    mutationFn: async ({ userId, email, password, name }) => {
      const { data, errors } = await graphql.mutation({
        query: createAccount,
        variables: {
          userId: userId ?? ID.unique(),
          name,
          email,
          password,
        },
      })

      if (errors) {
        throw errors
      }

      return data.accountCreate
    },
  })

  const verifyEmail = useMutation<VerifyEmailResult, AppwriteException[], VerifyEmailVariables>({
    mutationKey: Keys.account().emailVerification().create(),
    mutationFn: async ({ verifyUrl }) => {
      const { data, errors } = await graphql.mutation({
        query: verify,
        variables: {
          url: verifyUrl,
        },
      })

      if (errors) {
        throw errors
      }

      return data.accountCreateVerification
    },
  })

  return { signUp, verifyEmail }
}
