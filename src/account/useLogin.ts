import type { ResultOf, VariablesOf } from 'gql.tada'
import { graphql as gql } from 'gql.tada'

import { Keys } from '../query/Keys'
import type { AppwriteException, OAuthProvider, Prettify } from '../types'
import { useAppwrite } from '../useAppwrite'
import { useMutation } from '../useMutation'
import { useQueryClient } from '../useQueryClient'

/** The variables accepted by the OAuth login mutation in {@link useLogin}. */
export type OAuthLoginVariables = {
  provider: OAuthProvider
  success?: string
  failure?: string
}

const accountCreateEmailPasswordSession = gql(/* GraphQL */ `
  mutation CreateEmailPasswordSession($email: String!, $password: String!) {
    accountCreateEmailPasswordSession(email: $email, password: $password) {
      userId
      expire
      current
    }
  }
`)

/** The variables accepted by the {@link useLogin} mutation. */
export type LoginVariables = Prettify<VariablesOf<typeof accountCreateEmailPasswordSession>>
/** The result returned by the {@link useLogin} mutation. */
export type LoginResult = Prettify<
  ResultOf<typeof accountCreateEmailPasswordSession>['accountCreateEmailPasswordSession']
>

/**
 * Returns `login` and `oAuthLogin` mutations for authenticating users.
 *
 * `login` handles email/password sessions; `oAuthLogin` handles OAuth2
 * provider sessions. Invalidates account and session queries on successful
 * email/password login.
 *
 * @example
 * ```tsx
 * const { login, oAuthLogin } = useLogin()
 *
 * // Email/password login
 * login.mutate({
 *   email: 'user@example.com',
 *   password: 'my-secure-password',
 * })
 * ```
 *
 * @example
 * ```tsx
 * const { login, oAuthLogin } = useLogin()
 *
 * // OAuth2 login
 * oAuthLogin.mutate({
 *   provider: OAuthProvider.Google,
 *   success: 'https://example.com/auth/callback',
 *   failure: 'https://example.com/auth/error',
 * })
 * ```
 *
 * **`login` variables** ({@link LoginVariables}):
 * - `email` — User's email address
 * - `password` — User's password
 *
 * **`oAuthLogin` variables** ({@link OAuthLoginVariables}):
 * - `provider` — The OAuth2 provider (e.g., `OAuthProvider.Google`)
 * - `success` — Optional. URL to redirect to on successful authentication
 * - `failure` — Optional. URL to redirect to on failed authentication
 *
 * @returns An object with `login` (`UseMutationResult` with session `userId`, `expire`, `current`) and `oAuthLogin` (`UseMutationResult` that resolves to `void` or a redirect URL string).
 */
export function useLogin() {
  const { account, graphql } = useAppwrite()
  const queryClient = useQueryClient()

  const login = useMutation<LoginResult, AppwriteException[], LoginVariables>({
    mutationKey: Keys.account().login().create(),
    mutationFn: async ({ email, password }) => {
      const { data, errors } = await graphql.mutation({
        query: accountCreateEmailPasswordSession,
        variables: {
          email,
          password,
        },
      })

      if (errors) {
        throw errors
      }

      return data.accountCreateEmailPasswordSession
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: Keys.account().key() })
      void queryClient.invalidateQueries({
        queryKey: Keys.account().sessions(),
      })
    },
  })

  const oAuthLogin = useMutation<void | string, AppwriteException[], OAuthLoginVariables>({
    mutationFn: async ({ provider, success, failure }) => {
      return account.createOAuth2Session({ provider, success, failure })
    },
  })

  return {
    login,
    oAuthLogin,
  }
}
