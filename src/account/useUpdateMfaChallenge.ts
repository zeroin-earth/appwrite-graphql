import type { ResultOf, VariablesOf } from 'gql.tada'
import { graphql as gql } from 'gql.tada'

import { Keys } from '../query/Keys'
import type { AppwriteException, Prettify } from '../types'
import { useAppwrite } from '../useAppwrite'
import { useMutation } from '../useMutation'

const accountUpdateMfaChallenge = gql(/* GraphQL */ `
  mutation UpdateMfaChallenge($challengeId: String!, $otp: String!) {
    accountUpdateMfaChallenge(challengeId: $challengeId, otp: $otp) {
      _id
      userId
      expire
      current
    }
  }
`)

/** The variables accepted by the {@link useUpdateMfaChallenge} mutation. */
export type UpdateMfaChallengeVariables = Prettify<VariablesOf<typeof accountUpdateMfaChallenge>>
/** The result returned by the {@link useUpdateMfaChallenge} mutation. */
export type UpdateMfaChallengeResult = Prettify<
  ResultOf<typeof accountUpdateMfaChallenge>['accountUpdateMfaChallenge']
>

/**
 * Mutation hook to complete an MFA challenge by providing the `challengeId` and `otp` code.
 *
 * Verifies the one-time password against the challenge created by
 * {@link useCreateMfaChallenge}. On success, a new session is established.
 *
 * @example
 * ```tsx
 * const { mutate, isPending } = useUpdateMfaChallenge()
 *
 * mutate({
 *   challengeId: 'challenge-abc',
 *   otp: '123456',
 * })
 * ```
 *
 * **Variables** ({@link UpdateMfaChallengeVariables}):
 * - `challengeId` — The challenge ID returned by {@link useCreateMfaChallenge}
 * - `otp` — The one-time password from the user's authenticator, SMS, or email
 *
 * @returns A `UseMutationResult` with the session's `_id`, `userId`, `expire`, and `current` fields.
 */
export function useUpdateMfaChallenge() {
  const { graphql } = useAppwrite()

  const queryResult = useMutation<
    UpdateMfaChallengeResult,
    AppwriteException[],
    UpdateMfaChallengeVariables
  >({
    mutationKey: Keys.account().mfaChallenge().update(),
    mutationFn: async ({ challengeId, otp }) => {
      const { data, errors } = await graphql.mutation({
        query: accountUpdateMfaChallenge,
        variables: {
          challengeId,
          otp,
        },
      })

      if (errors) {
        throw errors
      }

      return data?.accountUpdateMfaChallenge ?? null
    },
  })

  return queryResult
}
