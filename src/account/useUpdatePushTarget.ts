import { gql } from '../__generated__'
import type {
  UpdatePushTargetMutation,
  UpdatePushTargetMutationVariables,
} from '../__generated__/graphql'
import type { AppwriteException } from '../types'
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

export function useUpdatePushTarget() {
  const { graphql } = useAppwrite()
  const queryClient = useQueryClient()

  const queryResult = useMutation<
    UpdatePushTargetMutation['accountUpdatePushTarget'],
    AppwriteException[],
    UpdatePushTargetMutationVariables
  >({
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
      void queryClient.invalidateQueries({ queryKey: ['appwrite', 'account'] })
    },
  })

  return { ...queryResult }
}
