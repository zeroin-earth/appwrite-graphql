import type { ResultOf, VariablesOf } from 'gql.tada'
import { graphql as gql } from 'gql.tada'

import { Keys } from '../query/Keys'
import type { AppwriteException, Prettify } from '../types'
import { useAppwrite } from '../useAppwrite'
import { useMutation } from '../useMutation'
import { useQueryClient } from '../useQueryClient'

const updateMagicURLSession = gql(/* GraphQL */ `
  mutation UpdateMagicURLSession($userId: String!, $secret: String!) {
    accountUpdateMagicURLSession(userId: $userId, secret: $secret) {
      userId
      expire
      current
    }
  }
`)

/** The variables accepted by the {@link useUpdateMagicURLSession} mutation. */
export type UpdateMagicURLSessionVariables = Prettify<VariablesOf<typeof updateMagicURLSession>>
/** The result returned by the {@link useUpdateMagicURLSession} mutation. */
export type UpdateMagicURLSessionResult = Prettify<
  ResultOf<typeof updateMagicURLSession>['accountUpdateMagicURLSession']
>

/**
 * Mutation hook to validate a magic URL session using `userId` and `secret`.
 *
 * Completes the magic URL authentication flow started by
 * {@link useCreateMagicURLToken}. The `userId` and `secret` are provided
 * in the magic URL query parameters. Invalidates account and session
 * queries on success.
 *
 * @example
 * ```tsx
 * const { mutate, isPending } = useUpdateMagicURLSession()
 *
 * // Extract userId and secret from the magic URL
 * mutate({
 *   userId: 'user-123',
 *   secret: 'magic-url-secret',
 * })
 * ```
 *
 * **Variables** ({@link UpdateMagicURLSessionVariables}):
 * - `userId` — The user's ID from the magic URL
 * - `secret` — The secret token from the magic URL
 *
 * @returns A `UseMutationResult` with the session's `userId`, `expire`, and `current` fields.
 */
export function useUpdateMagicURLSession() {
  const { graphql } = useAppwrite()
  const queryClient = useQueryClient()

  const queryResult = useMutation<
    UpdateMagicURLSessionResult,
    AppwriteException[],
    UpdateMagicURLSessionVariables
  >({
    mutationKey: Keys.account().magicUrl().update(),
    mutationFn: async ({ userId, secret }) => {
      const { data, errors } = await graphql.mutation({
        query: updateMagicURLSession,
        variables: {
          userId,
          secret,
        },
      })

      if (errors) {
        throw errors
      }

      return data.accountUpdateMagicURLSession
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
