import type { ResultOf, VariablesOf } from 'gql.tada'
import { graphql as gql } from 'gql.tada'

import { Keys } from '../query/Keys'
import type { AppwriteException, Prettify } from '../types'
import { useAppwrite } from '../useAppwrite'
import { useMutation } from '../useMutation'

const createPhoneToken = gql(/* GraphQL */ `
  mutation CreatePhoneToken($userId: String!, $phone: String!) {
    accountCreatePhoneToken(userId: $userId, phone: $phone) {
      expire
    }
  }
`)

/** The variables accepted by the {@link useCreatePhoneToken} mutation. */
export type CreatePhoneTokenVariables = Prettify<VariablesOf<typeof createPhoneToken>>
/** The result returned by the {@link useCreatePhoneToken} mutation. */
export type CreatePhoneTokenResult = Prettify<
  ResultOf<typeof createPhoneToken>['accountCreatePhoneToken']
>

/**
 * Mutation to send a phone token for SMS-based authentication.
 *
 * Sends a verification code via SMS that can be exchanged for a session
 * using {@link useCreateSession} or {@link useUpdatePhoneSession}.
 *
 * @example
 * ```tsx
 * const { mutate, isPending } = useCreatePhoneToken()
 *
 * mutate({
 *   userId: 'user-123',
 *   phone: '+14155551234',
 * })
 * ```
 *
 * **Variables** ({@link CreatePhoneTokenVariables}):
 * - `userId` — Unique user identifier
 * - `phone` — User's phone number in E.164 format (e.g., `"+14155551234"`)
 *
 * @returns A `UseMutationResult` with the token's `expire` timestamp.
 */
export function useCreatePhoneToken() {
  const { graphql } = useAppwrite()

  const queryResult = useMutation<
    CreatePhoneTokenResult,
    AppwriteException[],
    CreatePhoneTokenVariables
  >({
    mutationKey: Keys.account().phoneToken().create(),
    mutationFn: async ({ userId, phone }) => {
      const { data, errors } = await graphql.mutation({
        query: createPhoneToken,
        variables: {
          userId,
          phone,
        },
      })

      if (errors) {
        throw errors
      }

      return data.accountCreatePhoneToken
    },
  })

  return queryResult
}
