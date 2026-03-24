import type { ResultOf, VariablesOf } from 'gql.tada'
import { graphql as gql } from 'gql.tada'

import { Keys } from '../query/Keys'
import type { AppwriteException, Prettify } from '../types'
import { useAppwrite } from '../useAppwrite'
import { useMutation } from '../useMutation'

const createEmailToken = gql(/* GraphQL */ `
  mutation CreateEmailToken($userId: String!, $email: String!, $phrase: Boolean) {
    accountCreateEmailToken(userId: $userId, email: $email, phrase: $phrase) {
      expire
    }
  }
`)

/** The variables accepted by the {@link useCreateEmailToken} mutation. */
export type CreateEmailTokenVariables = Prettify<VariablesOf<typeof createEmailToken>>
/** The result returned by the {@link useCreateEmailToken} mutation. */
export type CreateEmailTokenResult = Prettify<
  ResultOf<typeof createEmailToken>['accountCreateEmailToken']
>

/**
 * Mutation to create an email token for passwordless authentication.
 *
 * Sends a token to the user's email that can be exchanged for a session
 * via {@link useCreateSession}.
 *
 * @example
 * ```tsx
 * const { mutate, isPending } = useCreateEmailToken()
 *
 * mutate({
 *   userId: 'user-123',
 *   email: 'user@example.com',
 *   phrase: true,
 * })
 * ```
 *
 * **Variables** ({@link CreateEmailTokenVariables}):
 * - `userId` — Unique user identifier
 * - `email` — User's email address to send the token to
 * - `phrase` — Optional. When `true`, returns a phrase-based token instead of a numeric code
 *
 * @returns A `UseMutationResult` with the token's `expire` timestamp.
 */
export function useCreateEmailToken() {
  const { graphql } = useAppwrite()

  const queryResult = useMutation<
    CreateEmailTokenResult,
    AppwriteException[],
    CreateEmailTokenVariables
  >({
    mutationKey: Keys.account().emailToken().create(),
    mutationFn: async ({ userId, email, phrase }) => {
      const { data, errors } = await graphql.mutation({
        query: createEmailToken,
        variables: {
          userId,
          email,
          phrase,
        },
      })

      if (errors) {
        throw errors
      }

      return data.accountCreateEmailToken
    },
  })

  return queryResult
}
