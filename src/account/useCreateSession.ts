import type { ResultOf, VariablesOf } from 'gql.tada'
import { graphql as gql } from 'gql.tada'

import { Keys } from '../query/Keys'
import type { AppwriteException, Prettify } from '../types'
import { useAppwrite } from '../useAppwrite'
import { useMutation } from '../useMutation'
import { useQueryClient } from '../useQueryClient'

const createSession = gql(/* GraphQL */ `
  mutation CreateSession($userId: String!, $secret: String!) {
    accountCreateSession(userId: $userId, secret: $secret) {
      userId
      expire
      current
    }
  }
`)

/** The variables accepted by the {@link useCreateSession} mutation. */
export type CreateSessionVariables = Prettify<VariablesOf<typeof createSession>>
/** The result returned by the {@link useCreateSession} mutation. */
export type CreateSessionResult = Prettify<ResultOf<typeof createSession>['accountCreateSession']>

/**
 * Mutation to create a session using a `userId` and `secret` (e.g., from an email/phone token).
 *
 * Exchanges a token pair for a full session. Typically used after
 * {@link useCreateEmailToken} or {@link useCreatePhoneToken}. Invalidates
 * account and session queries on success.
 *
 * @example
 * ```tsx
 * const { mutate, isPending } = useCreateSession()
 *
 * mutate({
 *   userId: 'user-123',
 *   secret: 'token-secret-from-email',
 * })
 * ```
 *
 * **Variables** ({@link CreateSessionVariables}):
 * - `userId` — The user's ID received from the token creation step
 * - `secret` — The secret received from the token creation step
 *
 * @returns A `UseMutationResult` with the session's `userId`, `expire`, and `current` fields.
 */
export function useCreateSession() {
  const { graphql } = useAppwrite()
  const queryClient = useQueryClient()

  const queryResult = useMutation<CreateSessionResult, AppwriteException[], CreateSessionVariables>(
    {
      mutationKey: Keys.account().session().create(),
      mutationFn: async ({ userId, secret }) => {
        const { data, errors } = await graphql.mutation({
          query: createSession,
          variables: {
            userId,
            secret,
          },
        })

        if (errors) {
          throw errors
        }

        return data.accountCreateSession
      },
      onSuccess: () => {
        void queryClient.invalidateQueries({ queryKey: Keys.account().key() })
        void queryClient.invalidateQueries({
          queryKey: Keys.account().sessions(),
        })
      },
    },
  )

  return queryResult
}
