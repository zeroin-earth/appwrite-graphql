import { AppwriteException } from '../types'

import { gql } from '../__generated__'
import {
  CreatePushTargetMutation,
  CreatePushTargetMutationVariables,
} from '../__generated__/graphql'
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

export function useCreatePushTarget() {
  const { graphql } = useAppwrite()
  const queryClient = useQueryClient()

  const queryResult = useMutation<
    CreatePushTargetMutation['accountCreatePushTarget'],
    AppwriteException[],
    CreatePushTargetMutationVariables
  >({
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
      queryClient.invalidateQueries({ queryKey: ['appwrite', 'account'] })
    },
  })

  return { ...queryResult }
}
