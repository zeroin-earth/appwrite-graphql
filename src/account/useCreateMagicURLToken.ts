import type { ResultOf, VariablesOf } from 'gql.tada'
import { graphql as gql } from 'gql.tada'

import { Keys } from '../query/Keys'
import type { AppwriteException, Prettify } from '../types'
import { useAppwrite } from '../useAppwrite'
import { useMutation } from '../useMutation'

const createMagicURLToken = gql(/* GraphQL */ `
  mutation CreateMagicURLToken($userId: String!, $email: String!, $url: String, $phrase: Boolean) {
    accountCreateMagicURLToken(userId: $userId, email: $email, url: $url, phrase: $phrase) {
      expire
    }
  }
`)

/** The variables accepted by the {@link useCreateMagicURLToken} mutation. */
export type CreateMagicURLTokenVariables = Prettify<VariablesOf<typeof createMagicURLToken>>
/** The result returned by the {@link useCreateMagicURLToken} mutation. */
export type CreateMagicURLTokenResult = Prettify<
  ResultOf<typeof createMagicURLToken>['accountCreateMagicURLToken']
>

/**
 * Mutation to send a magic URL login token to a user's email.
 *
 * The magic URL link contains a `userId` and `secret` that can be used
 * with {@link useUpdateMagicURLSession} to create a session.
 *
 * @example
 * ```tsx
 * const { mutate, isPending } = useCreateMagicURLToken()
 *
 * mutate({
 *   userId: 'user-123',
 *   email: 'user@example.com',
 *   url: 'https://example.com/magic-login',
 *   phrase: true,
 * })
 * ```
 *
 * **Variables** ({@link CreateMagicURLTokenVariables}):
 * - `userId` — Unique user identifier
 * - `email` — User's email address to send the magic URL to
 * - `url` — Optional. Custom URL for the magic link redirect
 * - `phrase` — Optional. When `true`, returns a phrase-based token instead of a numeric code
 *
 * @returns A `UseMutationResult` with the token's `expire` timestamp.
 */
export function useCreateMagicURLToken() {
  const { graphql } = useAppwrite()

  const queryResult = useMutation<
    CreateMagicURLTokenResult,
    AppwriteException[],
    CreateMagicURLTokenVariables
  >({
    mutationKey: Keys.account().magicUrl().create(),
    mutationFn: async ({ userId, email, url, phrase }) => {
      const { data, errors } = await graphql.mutation({
        query: createMagicURLToken,
        variables: {
          userId,
          email,
          url,
          phrase,
        },
      })

      if (errors) {
        throw errors
      }

      return data.accountCreateMagicURLToken
    },
  })

  return queryResult
}
