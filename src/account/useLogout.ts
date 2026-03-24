import type { ResultOf, VariablesOf } from 'gql.tada'
import { graphql as gql } from 'gql.tada'

import { Keys } from '../query/Keys'
import type { AppwriteException, Prettify } from '../types'
import { useAppwrite } from '../useAppwrite'
import { useMutation } from '../useMutation'
import { useQueryClient } from '../useQueryClient'

const deleteSession = gql(/* GraphQL */ `
  mutation DeleteSession($sessionId: String!) {
    accountDeleteSession(sessionId: $sessionId) {
      status
    }
  }
`)

/** The variables accepted by the {@link useLogout} mutation. */
export type LogoutVariables = Prettify<VariablesOf<typeof deleteSession>>
/** The result returned by the {@link useLogout} mutation. */
export type LogoutResult = Prettify<ResultOf<typeof deleteSession>['accountDeleteSession']>

/**
 * Mutation to delete a session by its ID.
 *
 * Unlike {@link useDeleteSession}, this hook **clears the entire query cache**
 * on success, making it suitable for "log out" flows where the user should
 * be fully de-authenticated.
 *
 * @example
 * ```tsx
 * const { mutate, isPending } = useLogout()
 *
 * mutate({ sessionId: 'current' })
 * ```
 *
 * **Variables** ({@link LogoutVariables}):
 * - `sessionId` — The ID of the session to delete (use `"current"` for the active session)
 *
 * @returns A `UseMutationResult` with a `status` string indicating the operation result.
 */
export function useLogout() {
  const { graphql } = useAppwrite()
  const queryClient = useQueryClient()

  const queryResult = useMutation<LogoutResult, AppwriteException[], LogoutVariables>({
    mutationKey: Keys.account().session().delete(),
    mutationFn: async ({ sessionId }) => {
      const { data, errors } = await graphql.mutation({
        query: deleteSession,
        variables: {
          sessionId,
        },
      })

      if (errors) {
        throw errors
      }

      return data?.accountDeleteSession ?? { status: '' }
    },
    onSuccess: async () => {
      queryClient.clear()
    },
  })

  return queryResult
}
