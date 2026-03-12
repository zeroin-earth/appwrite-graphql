import type { ResultOf, VariablesOf } from 'gql.tada'
import { graphql as gql } from 'gql.tada'

import { Keys } from '../query/Keys'
import type { AppwriteException } from '../types'
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

type Variables = VariablesOf<typeof createSubscriber>
type Result = ResultOf<typeof createSubscriber>['messagingCreateSubscriber']

export function useCreateSubscriber() {
  const { graphql } = useAppwrite()

  const mutationResult = useMutation<Result, AppwriteException[], Variables>({
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

  return { ...mutationResult }
}
