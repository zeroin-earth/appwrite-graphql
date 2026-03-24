import type { ResultOf, VariablesOf } from 'gql.tada'
import { graphql as gql } from 'gql.tada'

import { Keys } from '../query/Keys'
import type { AppwriteException, Prettify } from '../types'
import { useAppwrite } from '../useAppwrite'
import { useMutation } from '../useMutation'
import { useQueryClient } from '../useQueryClient'

const updateSession = gql(/* GraphQL */ `
  mutation UpdateSession($sessionId: String!) {
    accountUpdateSession(sessionId: $sessionId) {
      userId
      expire
      current
    }
  }
`)

/** The variables accepted by the {@link useUpdateSession} mutation. */
export type UpdateSessionVariables = Prettify<VariablesOf<typeof updateSession>>
/** The result returned by the {@link useUpdateSession} mutation. */
export type UpdateSessionResult = Prettify<ResultOf<typeof updateSession>['accountUpdateSession']>

/**
 * Mutation hook to extend a session's expiry by its ID.
 *
 * Refreshes the session so it does not expire. Invalidates session list
 * queries on success.
 *
 * @example
 * ```tsx
 * const { mutate, isPending } = useUpdateSession()
 *
 * mutate({ sessionId: 'current' })
 * ```
 *
 * **Variables** ({@link UpdateSessionVariables}):
 * - `sessionId` — The ID of the session to extend (use `"current"` for the active session)
 *
 * @returns A `UseMutationResult` with the session's `userId`, `expire`, and `current` fields.
 */
export function useUpdateSession() {
  const { graphql } = useAppwrite()
  const queryClient = useQueryClient()

  const queryResult = useMutation<UpdateSessionResult, AppwriteException[], UpdateSessionVariables>(
    {
      mutationKey: Keys.account().session().update(),
      mutationFn: async ({ sessionId }) => {
        const { data, errors } = await graphql.mutation({
          query: updateSession,
          variables: {
            sessionId,
          },
        })

        if (errors) {
          throw errors
        }

        return data.accountUpdateSession
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
