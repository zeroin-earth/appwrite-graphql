import { gql } from '../__generated__'
import type { UpdateStatusMutation } from '../__generated__/graphql'
import type { AppwriteException } from '../types'
import { useAppwrite } from '../useAppwrite'
import { useMutation } from '../useMutation'
import { useQueryClient } from '../useQueryClient'

const accountUpdateStatus = gql(/* GraphQL */ `
  mutation UpdateStatus {
    accountUpdateStatus {
      _id
      status
    }
  }
`)

export function useUpdateStatus() {
  const { graphql } = useAppwrite()
  const queryClient = useQueryClient()

  const queryResult = useMutation<UpdateStatusMutation['accountUpdateStatus'], AppwriteException[]>(
    {
      mutationFn: async () => {
        const { data, errors } = await graphql.mutation({
          query: accountUpdateStatus,
        })

        if (errors) {
          throw errors
        }

        return data.accountUpdateStatus
      },
      onSuccess: async () => {
        void queryClient.invalidateQueries({ queryKey: ['appwrite', 'account'] })
      },
    },
  )

  return { ...queryResult }
}
