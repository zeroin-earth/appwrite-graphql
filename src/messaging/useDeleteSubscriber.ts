import { gql } from '../__generated__'
import type {
  DeleteSubscriberMutation,
  DeleteSubscriberMutationVariables,
} from '../__generated__/graphql'
import type { AppwriteException } from '../types'
import { useAppwrite } from '../useAppwrite'
import { useMutation } from '../useMutation'

const deleteSubscriber = gql(/* GraphQL */ `
  mutation DeleteSubscriber($topicId: String!, $subscriberId: String!) {
    messagingDeleteSubscriber(topicId: $topicId, subscriberId: $subscriberId) {
      status
    }
  }
`)

export function useDeleteSubscriber() {
  const { graphql } = useAppwrite()

  const mutationResult = useMutation<
    DeleteSubscriberMutation['messagingDeleteSubscriber'],
    AppwriteException[],
    DeleteSubscriberMutationVariables
  >({
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

  return { ...mutationResult }
}
