import { Keys } from '../query/Keys'
import type { AppwriteException, OAuthProvider, Prettify } from '../types'
import { useAppwrite } from '../useAppwrite'
import { useMutation } from '../useMutation'

type Vars = {
  provider: OAuthProvider
  success?: string
  failure?: string
  scopes?: string[]
}

/** The variables accepted by the {@link useCreateOAuth2Token} mutation. */
export type CreateOAuth2TokenVariables = Prettify<Vars>

/**
 * Mutation to create an OAuth2 authentication token.
 *
 * Triggers the OAuth2 flow using the Appwrite REST SDK (not GraphQL).
 * On web, this typically redirects the user to the provider's authorization page.
 *
 * @example
 * ```tsx
 * const { mutate, isPending } = useCreateOAuth2Token()
 *
 * mutate({
 *   provider: OAuthProvider.Google,
 *   success: 'https://example.com/auth/callback',
 *   failure: 'https://example.com/auth/error',
 *   scopes: ['email', 'profile'],
 * })
 * ```
 *
 * **Variables** ({@link CreateOAuth2TokenVariables}):
 * - `provider` — The OAuth2 provider (e.g., `OAuthProvider.Google`, `OAuthProvider.GitHub`)
 * - `success` — Optional. URL to redirect to on successful authentication
 * - `failure` — Optional. URL to redirect to on failed authentication
 * - `scopes` — Optional. Array of OAuth2 scopes to request from the provider
 *
 * @returns A `UseMutationResult` that resolves to `void` or a redirect URL string.
 */
export function useCreateOAuth2Token() {
  const { account } = useAppwrite()

  const queryResult = useMutation<void | string, AppwriteException[], CreateOAuth2TokenVariables>({
    mutationKey: Keys.account().oauth2Token().create(),
    mutationFn: async ({ provider, success, failure, scopes }) => {
      return account.createOAuth2Token({ provider, success, failure, scopes })
    },
  })

  return queryResult
}
