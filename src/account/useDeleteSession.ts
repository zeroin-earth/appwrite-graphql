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

/** The variables accepted by the {@link useDeleteSession} mutation. */
export type DeleteSessionVariables = Prettify<VariablesOf<typeof deleteSession>>
/** The result returned by the {@link useDeleteSession} mutation. */
export type DeleteSessionResult = Prettify<ResultOf<typeof deleteSession>['accountDeleteSession']>

/**
 * Mutation hook to delete a specific session by its ID.
 *
 * Removes the session without clearing the entire query cache (unlike
 * {@link useLogout} or {@link useDeleteSessions}). Invalidates session
 * list queries on success.
 *
 * @example
 * ```tsx
 * const { mutate, isPending } = useDeleteSession()
 *
 * mutate({ sessionId: 'session-abc' })
 * ```
 *
 * **Variables** ({@link DeleteSessionVariables}):
 * - `sessionId` — The ID of the session to delete
 *
 * @returns A `UseMutationResult` with a `status` string indicating the operation result.
 */
export function useDeleteSession() {
  const { graphql } = useAppwrite()
  const queryClient = useQueryClient()

  const queryResult = useMutation<DeleteSessionResult, AppwriteException[], DeleteSessionVariables>(
    {
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
      onSuccess: () => {
        void queryClient.invalidateQueries({
          queryKey: Keys.account().sessions(),
        })
      },
    },
  )

  return queryResult
}
