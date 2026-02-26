import { gql } from '../__generated__'
import { UpdateNameMutation, UpdateNameMutationVariables, User } from '../__generated__/graphql'
import { useAppwrite } from '../useAppwrite'
import { useMutation } from '../useMutation'
import { useQueryClient } from '../useQueryClient'
import { AppwriteException } from '../types'

const accountUpdateName = gql(/* GraphQL */ `
  mutation UpdateName($name: String!) {
    accountUpdateName(name: $name) {
      name
    }
  }
`)

export function useUpdateName() {
  const { graphql } = useAppwrite()
  const queryClient = useQueryClient()

  const queryResult = useMutation<
    UpdateNameMutation['accountUpdateName'],
    AppwriteException[],
    UpdateNameMutationVariables
  >({
    mutationFn: async ({ name }) => {
      const { data: mutationData, errors } = await graphql.mutation({
        query: accountUpdateName,
        variables: {
          name,
        },
      })

      if (errors) {
        throw errors
      }

      return mutationData.accountUpdateName
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appwrite', 'account'] })
    },
  })

  return { ...queryResult }
}
