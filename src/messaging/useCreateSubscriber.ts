import { gql } from '../__generated__'
import type {
  CreateSubscriberMutation,
  CreateSubscriberMutationVariables,
} from '../__generated__/graphql'
import type { AppwriteException } from '../types'
import { useAppwrite } from '../useAppwrite'
import { useMutation } from '../useMutation'

const createSubscriber = gql(/* GraphQL */ `
  mutation CreateSubscriber($subscriberId: String!, $topicId: String!, $targetId: String!) {
    messagingCreateSubscriber(
      subscriberId: $subscriberId
      topicId: $topicId
      targetId: $targetId
    ) {
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

export function useCreateSubscriber() {
  const { graphql } = useAppwrite()

  const mutationResult = useMutation<
    CreateSubscriberMutation['messagingCreateSubscriber'],
    AppwriteException[],
    CreateSubscriberMutationVariables
  >({
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

  return { ...mutationResult }
}
