import type { ResultOf } from 'gql.tada'
import { graphql as gql } from 'gql.tada'

import { Keys } from '../query/Keys'
import type { AppwriteException, Prettify } from '../types'
import { useAppwrite } from '../useAppwrite'
import { useMutation } from '../useMutation'
import { useQueryClient } from '../useQueryClient'

const deleteSessions = gql(/* GraphQL */ `
  mutation DeleteSessions {
    accountDeleteSessions {
      status
    }
  }
`)

/** The result returned by the {@link useDeleteSessions} mutation. */
export type DeleteSessionsResult = Prettify<
  ResultOf<typeof deleteSessions>['accountDeleteSessions']
>

/**
 * Mutation hook to delete all sessions for the current user.
 *
 * Logs the user out of every device. Invalidates account and session queries
 * and **clears the entire query cache** on success.
 *
 * @example
 * ```tsx
 * const { mutate, isPending } = useDeleteSessions()
 *
 * mutate()
 * ```
 *
 * This mutation takes no variables.
 *
 * @returns A `UseMutationResult` with a `status` string indicating the operation result.
 */
export function useDeleteSessions() {
  const { graphql } = useAppwrite()
  const queryClient = useQueryClient()

  const queryResult = useMutation<DeleteSessionsResult, AppwriteException[], void>({
    mutationKey: Keys.account().session().delete(),
    mutationFn: async () => {
      const { data, errors } = await graphql.mutation({
        query: deleteSessions,
      })

      if (errors) {
        throw errors
      }

      return data?.accountDeleteSessions ?? { status: '' }
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: Keys.account().key() })
      void queryClient.invalidateQueries({
        queryKey: Keys.account().sessions(),
      })
      queryClient.clear()
    },
  })

  return queryResult
}
