import type { ResultOf } from 'gql.tada'
import { graphql as gql } from 'gql.tada'

import { Keys } from '../query/Keys'
import type { AppwriteException, AuthenticationFactor, Prettify } from '../types'
import { useAppwrite } from '../useAppwrite'
import { useMutation } from '../useMutation'

const accountCreateMfaChallenge = gql(/* GraphQL */ `
  mutation CreateMfaChallenge($factor: String!) {
    accountCreateMfaChallenge(factor: $factor) {
      _id
      userId
      expire
    }
  }
`)

type Vars = {
  /** The authentication factor. Defaults to `AuthenticatorType.Totp`. */
  factor: AuthenticationFactor
}
/** The variables accepted by the {@link useCreateMfaChallenge} mutation. */
export type CreateMfaChallengeVariables = Prettify<Vars>
/** The result returned by the {@link useCreateMfaChallenge} mutation. */
export type CreateMfaChallengeResult = Prettify<
  ResultOf<typeof accountCreateMfaChallenge>['accountCreateMfaChallenge']
>

/**
 * Mutation to create an MFA challenge for a given factor (e.g., `"totp"`, `"phone"`, `"email"`).
 *
 * Creates a challenge that must be completed with {@link useUpdateMfaChallenge}
 * by providing the challenge ID and the one-time password.
 *
 * @example
 * ```tsx
 * const { mutate, data, isPending } = useCreateMfaChallenge()
 *
 * mutate({ factor: 'totp' })
 *
 * // Use data._id as the challengeId for useUpdateMfaChallenge
 * ```
 *
 * **Variables** ({@link CreateMfaChallengeVariables}):
 * - `factor` — The MFA factor to challenge (e.g., `"totp"`, `"phone"`, `"email"`)
 *
 * @returns A `UseMutationResult` with the challenge's `_id`, `userId`, and `expire` fields.
 */
export function useCreateMfaChallenge() {
  const { graphql } = useAppwrite()

  const queryResult = useMutation<
    CreateMfaChallengeResult,
    AppwriteException[],
    CreateMfaChallengeVariables
  >({
    mutationKey: Keys.account().mfaChallenge().create(),
    mutationFn: async ({ factor }) => {
      const { data, errors } = await graphql.mutation({
        query: accountCreateMfaChallenge,
        variables: {
          factor,
        },
      })

      if (errors) {
        throw errors
      }

      return data.accountCreateMfaChallenge
    },
  })

  return queryResult
}
