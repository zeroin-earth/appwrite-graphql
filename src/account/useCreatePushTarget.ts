import type { ResultOf, VariablesOf } from 'gql.tada'
import { graphql as gql } from 'gql.tada'

import { Keys } from '../query/Keys'
import type { AppwriteException, Prettify } from '../types'
import { useAppwrite } from '../useAppwrite'
import { useMutation } from '../useMutation'
import { useQueryClient } from '../useQueryClient'

const accountCreatePushTarget = gql(/* GraphQL */ `
  mutation CreatePushTarget($targetId: String!, $identifier: String!, $providerId: String) {
    accountCreatePushTarget(targetId: $targetId, identifier: $identifier, providerId: $providerId) {
      _id
      userId
      providerType
      identifier
    }
  }
`)

/** The variables accepted by the {@link useCreatePushTarget} mutation. */
export type CreatePushTargetVariables = Prettify<VariablesOf<typeof accountCreatePushTarget>>
/** The result returned by the {@link useCreatePushTarget} mutation. */
export type CreatePushTargetResult = Prettify<
  ResultOf<typeof accountCreatePushTarget>['accountCreatePushTarget']
>

/**
 * Mutation to register a push notification target for the current user.
 *
 * Registers a device token so the user can receive push notifications.
 * Invalidates account queries on success.
 *
 * @example
 * ```tsx
 * const { mutate, isPending } = useCreatePushTarget()
 *
 * mutate({
 *   targetId: 'target-123',
 *   identifier: 'fcm-device-token-abc',
 *   providerId: 'firebase-provider',
 * })
 * ```
 *
 * **Variables** ({@link CreatePushTargetVariables}):
 * - `targetId` — Unique target identifier for the push target
 * - `identifier` — The device token or registration ID from the push notification service
 * - `providerId` — Optional. The messaging provider ID configured in Appwrite
 *
 * @returns A `UseMutationResult` with the push target's `_id`, `userId`, `providerType`, and `identifier`.
 */
export function useCreatePushTarget() {
  const { graphql } = useAppwrite()
  const queryClient = useQueryClient()

  const queryResult = useMutation<
    CreatePushTargetResult,
    AppwriteException[],
    CreatePushTargetVariables
  >({
    mutationKey: Keys.account().pushTarget().create(),
    mutationFn: async ({ targetId, identifier, providerId }) => {
      const { data, errors } = await graphql.mutation({
        query: accountCreatePushTarget,
        variables: {
          targetId,
          identifier,
          providerId,
        },
      })

      if (errors) {
        throw errors
      }

      return data.accountCreatePushTarget
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: Keys.account().key() })
    },
  })

  return queryResult
}
