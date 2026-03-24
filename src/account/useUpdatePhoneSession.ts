import type { ResultOf, VariablesOf } from 'gql.tada'
import { graphql as gql } from 'gql.tada'

import { Keys } from '../query/Keys'
import type { AppwriteException, Prettify } from '../types'
import { useAppwrite } from '../useAppwrite'
import { useMutation } from '../useMutation'
import { useQueryClient } from '../useQueryClient'

const updatePhoneSession = gql(/* GraphQL */ `
  mutation UpdatePhoneSession($userId: String!, $secret: String!) {
    accountUpdatePhoneSession(userId: $userId, secret: $secret) {
      userId
      expire
      current
    }
  }
`)

/** The variables accepted by the {@link useUpdatePhoneSession} mutation. */
export type UpdatePhoneSessionVariables = Prettify<VariablesOf<typeof updatePhoneSession>>
/** The result returned by the {@link useUpdatePhoneSession} mutation. */
export type UpdatePhoneSessionResult = Prettify<
  ResultOf<typeof updatePhoneSession>['accountUpdatePhoneSession']
>

/**
 * Mutation hook to validate a phone session using `userId` and `secret`.
 *
 * Completes the phone-based authentication flow started by
 * {@link useCreatePhoneToken}. Invalidates account and session queries
 * on success.
 *
 * @example
 * ```tsx
 * const { mutate, isPending } = useUpdatePhoneSession()
 *
 * mutate({
 *   userId: 'user-123',
 *   secret: '123456',
 * })
 * ```
 *
 * **Variables** ({@link UpdatePhoneSessionVariables}):
 * - `userId` — The user's ID received from the phone token step
 * - `secret` — The OTP code sent via SMS
 *
 * @returns A `UseMutationResult` with the session's `userId`, `expire`, and `current` fields.
 */
export function useUpdatePhoneSession() {
  const { graphql } = useAppwrite()
  const queryClient = useQueryClient()

  const queryResult = useMutation<
    UpdatePhoneSessionResult,
    AppwriteException[],
    UpdatePhoneSessionVariables
  >({
    mutationKey: Keys.account().phoneToken().update(),
    mutationFn: async ({ userId, secret }) => {
      const { data, errors } = await graphql.mutation({
        query: updatePhoneSession,
        variables: {
          userId,
          secret,
        },
      })

      if (errors) {
        throw errors
      }

      return data.accountUpdatePhoneSession
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: Keys.account().key() })
      void queryClient.invalidateQueries({
        queryKey: Keys.account().sessions(),
      })
    },
  })

  return queryResult
}
