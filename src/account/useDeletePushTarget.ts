import type { ResultOf, VariablesOf } from 'gql.tada'
import { graphql as gql } from 'gql.tada'

import { Keys } from '../query/Keys'
import type { AppwriteException, Prettify } from '../types'
import { useAppwrite } from '../useAppwrite'
import { useMutation } from '../useMutation'
import { useQueryClient } from '../useQueryClient'

const accountDeletePushTarget = gql(/* GraphQL */ `
  mutation DeletePushTarget($targetId: String!) {
    accountDeletePushTarget(targetId: $targetId) {
      status
    }
  }
`)

/** The variables accepted by the {@link useDeletePushTarget} mutation. */
export type DeletePushTargetVariables = Prettify<VariablesOf<typeof accountDeletePushTarget>>
/** The result returned by the {@link useDeletePushTarget} mutation. */
export type DeletePushTargetResult = Prettify<
  ResultOf<typeof accountDeletePushTarget>['accountDeletePushTarget']
>

/**
 * Mutation hook to delete a push notification target by its ID.
 *
 * Unregisters the device from receiving push notifications. Invalidates
 * account queries on success.
 *
 * @example
 * ```tsx
 * const { mutate, isPending } = useDeletePushTarget()
 *
 * mutate({ targetId: 'target-123' })
 * ```
 *
 * **Variables** ({@link DeletePushTargetVariables}):
 * - `targetId` — The ID of the push target to delete
 *
 * @returns A `UseMutationResult` with a `status` string indicating the operation result.
 */
export function useDeletePushTarget() {
  const { graphql } = useAppwrite()
  const queryClient = useQueryClient()

  const queryResult = useMutation<
    DeletePushTargetResult,
    AppwriteException[],
    DeletePushTargetVariables
  >({
    mutationKey: Keys.account().pushTarget().delete(),
    mutationFn: async ({ targetId }) => {
      const { data, errors } = await graphql.mutation({
        query: accountDeletePushTarget,
        variables: {
          targetId,
        },
      })

      if (errors) {
        throw errors
      }

      return data?.accountDeletePushTarget ?? { status: '' }
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: Keys.account().key() })
    },
  })

  return queryResult
}
