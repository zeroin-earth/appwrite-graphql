import type { ResultOf, VariablesOf } from 'gql.tada'
import { graphql as gql } from 'gql.tada'

import { Keys } from '../query/Keys'
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

type Variables = VariablesOf<typeof deleteSubscriber>
type Result = ResultOf<typeof deleteSubscriber>['messagingDeleteSubscriber']

export function useDeleteSubscriber() {
  const { graphql } = useAppwrite()

  const mutationResult = useMutation<Result, AppwriteException[], Variables>({
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

  return { ...mutationResult }
}
