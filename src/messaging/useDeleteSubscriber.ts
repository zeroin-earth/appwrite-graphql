import type { ResultOf, VariablesOf } from 'gql.tada'
import { graphql as gql } from 'gql.tada'

import { Keys } from '../query/Keys'
import type { AppwriteException, Prettify } from '../types'
import { useAppwrite } from '../useAppwrite'
import { useMutation } from '../useMutation'

export const deleteSubscriber = gql(/* GraphQL */ `
  mutation DeleteSubscriber($topicId: String!, $subscriberId: String!) {
    messagingDeleteSubscriber(topicId: $topicId, subscriberId: $subscriberId) {
      status
    }
  }
`)

/** The variables accepted by the {@link useDeleteSubscriber} hook. */
export type DeleteSubscriberVariables = Prettify<VariablesOf<typeof deleteSubscriber>>

/** The result returned by the {@link useDeleteSubscriber} hook. */
export type DeleteSubscriberResult = Prettify<
  ResultOf<typeof deleteSubscriber>['messagingDeleteSubscriber']
>

/**
 * Mutation to unsubscribe a target from a messaging topic.
 *
 * Sends the `DeleteSubscriber` GraphQL mutation. Does not perform any cache
 * invalidation — call `queryClient.invalidateQueries` manually if needed.
 *
 * @example
 * ```tsx
 * const { mutate, isPending } = useDeleteSubscriber()
 *
 * mutate({
 *   topicId: 'announcements',
 *   subscriberId: 'sub_abc123',
 * })
 * ```
 *
 * **Variables** ({@link DeleteSubscriberVariables}):
 * - `topicId` — The ID of the messaging topic to unsubscribe from
 * - `subscriberId` — The ID of the subscriber to remove
 *
 * @returns A `UseMutationResult` whose `data` is a {@link DeleteSubscriberResult} with a `status` field.
 */
export function useDeleteSubscriber() {
  const { graphql } = useAppwrite()

  const mutationResult = useMutation<
    DeleteSubscriberResult,
    AppwriteException[],
    DeleteSubscriberVariables
  >({
    mutationKey: Keys.messaging().subscriber().delete(),
    mutationFn: async ({ topicId, subscriberId }) => {
      const { data: mutationData, errors } = await graphql.mutation({
        query: deleteSubscriber,
        variables: {
          topicId,
          subscriberId,
        },
      })

      if (errors) {
        throw errors
      }

      return mutationData?.messagingDeleteSubscriber ?? { status: '' }
    },
  })

  return mutationResult
}
