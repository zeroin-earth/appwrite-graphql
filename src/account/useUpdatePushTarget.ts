import type { ResultOf, VariablesOf } from 'gql.tada'
import { graphql as gql } from 'gql.tada'

import { Keys } from '../query/Keys'
import type { AppwriteException, Prettify } from '../types'
import { useAppwrite } from '../useAppwrite'
import { useMutation } from '../useMutation'
import { useQueryClient } from '../useQueryClient'

const accountUpdatePushTarget = gql(/* GraphQL */ `
  mutation UpdatePushTarget($targetId: String!, $identifier: String!) {
    accountUpdatePushTarget(targetId: $targetId, identifier: $identifier) {
      _id
      userId
      providerType
      identifier
    }
  }
`)

/** The variables accepted by the {@link useUpdatePushTarget} mutation. */
export type UpdatePushTargetVariables = Prettify<VariablesOf<typeof accountUpdatePushTarget>>
/** The result returned by the {@link useUpdatePushTarget} mutation. */
export type UpdatePushTargetResult = Prettify<
  ResultOf<typeof accountUpdatePushTarget>['accountUpdatePushTarget']
>

/**
 * Mutation hook to update a push notification target's identifier.
 *
 * Replaces the device token on an existing push target. Invalidates
 * account queries on success.
 *
 * @example
 * ```tsx
 * const { mutate, isPending } = useUpdatePushTarget()
 *
 * mutate({
 *   targetId: 'target-123',
 *   identifier: 'new-fcm-device-token',
 * })
 * ```
 *
 * **Variables** ({@link UpdatePushTargetVariables}):
 * - `targetId` — The ID of the push target to update
 * - `identifier` — The new device token or registration ID
 *
 * @returns A `UseMutationResult` with the push target's `_id`, `userId`, `providerType`, and `identifier`.
 */
export function useUpdatePushTarget() {
  const { graphql } = useAppwrite()
  const queryClient = useQueryClient()

  const queryResult = useMutation<
    UpdatePushTargetResult,
    AppwriteException[],
    UpdatePushTargetVariables
  >({
    mutationKey: Keys.account().pushTarget().update(),
    mutationFn: async ({ targetId, identifier }) => {
      const { data, errors } = await graphql.mutation({
        query: accountUpdatePushTarget,
        variables: {
          targetId,
          identifier,
        },
      })

      if (errors) {
        throw errors
      }

      return data.accountUpdatePushTarget
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: Keys.account().key() })
    },
  })

  return queryResult
}
