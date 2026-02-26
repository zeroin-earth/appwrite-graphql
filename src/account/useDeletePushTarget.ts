import { AppwriteException } from '../types'

import { gql } from '../__generated__'
import {
  DeletePushTargetMutation,
  DeletePushTargetMutationVariables,
} from '../__generated__/graphql'
import { useAppwrite } from '../useAppwrite'
import { useMutation } from '../useMutation'
import { useQueryClient } from '../useQueryClient'

const accountDeletePushTarget = gql(/* GraphQL */ `
  mutation DeletePushTarget($targetId: String!) {
    accountDeletePushTarget(targetId: $targetId) {
      status
    }
  }
`)

export function useDeletePushTarget() {
  const { graphql } = useAppwrite()
  const queryClient = useQueryClient()

  const queryResult = useMutation<
    DeletePushTargetMutation['accountDeletePushTarget'],
    AppwriteException[],
    DeletePushTargetMutationVariables
  >({
    mutationFn: async ({ targetId }) => {
      const { data, errors } = await graphql.mutation({
        query: accountDeletePushTarget,
        variables: {
          targetId,
        },
      })

      if (errors) {
        throw errors
      }

      return data.accountDeletePushTarget
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appwrite', 'account'] })
    },
  })

  return { ...queryResult }
}
