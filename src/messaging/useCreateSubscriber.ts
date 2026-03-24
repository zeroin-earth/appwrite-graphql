import type { ResultOf, VariablesOf } from 'gql.tada'
import { graphql as gql } from 'gql.tada'

import { Keys } from '../query/Keys'
import type { AppwriteException, Prettify } from '../types'
import { useAppwrite } from '../useAppwrite'
import { useMutation } from '../useMutation'

export const createSubscriber = gql(/* GraphQL */ `
  mutation CreateSubscriber($subscriberId: String!, $topicId: String!, $targetId: String!) {
    messagingCreateSubscriber(subscriberId: $subscriberId, topicId: $topicId, targetId: $targetId) {
      _id
      _createdAt
      _updatedAt
      targetId
      userId
      userName
      topicId
      providerType
    }
  }
`)

/** The variables accepted by the {@link useCreateSubscriber} hook. */
export type CreateSubscriberVariables = Prettify<VariablesOf<typeof createSubscriber>>

/** The result returned by the {@link useCreateSubscriber} hook. */
export type CreateSubscriberResult = Prettify<
  ResultOf<typeof createSubscriber>['messagingCreateSubscriber']
>

/**
 * Mutation to subscribe a target to a messaging topic.
 *
 * Sends the `CreateSubscriber` GraphQL mutation. Does not perform any cache
 * invalidation — call `queryClient.invalidateQueries` manually if needed.
 *
 * @example
 * ```tsx
 * const { mutate, isPending } = useCreateSubscriber()
 *
 * mutate({
 *   subscriberId: ID.unique(),
 *   topicId: 'announcements',
 *   targetId: 'target_abc123',
 * })
 * ```
 *
 * **Variables** ({@link CreateSubscriberVariables}):
 * - `subscriberId` — A unique ID for the new subscriber (use `ID.unique()` to auto-generate)
 * - `topicId` — The ID of the messaging topic to subscribe to
 * - `targetId` — The ID of the target (e.g. device or user) to receive messages
 *
 * @returns A `UseMutationResult` whose `data` is the created {@link CreateSubscriberResult} with subscriber metadata including `_id`, `targetId`, `userId`, `userName`, `topicId`, and `providerType`.
 */
export function useCreateSubscriber() {
  const { graphql } = useAppwrite()

  const mutationResult = useMutation<
    CreateSubscriberResult,
    AppwriteException[],
    CreateSubscriberVariables
  >({
    mutationKey: Keys.messaging().subscriber().create(),
    mutationFn: async ({ subscriberId, topicId, targetId }) => {
      const { data: mutationData, errors } = await graphql.mutation({
        query: createSubscriber,
        variables: {
          subscriberId,
          topicId,
          targetId,
        },
      })

      if (errors) {
        throw errors
      }

      return mutationData?.messagingCreateSubscriber
    },
  })

  return mutationResult
}
