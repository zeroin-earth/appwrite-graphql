import { UseMutationOptions } from '@tanstack/react-query'
import { gql } from '../__generated__'
import { UpdateNameMutation, UpdateNameMutationVariables, User } from '../__generated__/graphql'
import { useAppwrite } from '../useAppwrite'
import { useMutation } from '../useMutation'
import { AppwriteException } from 'appwrite'

const accountUpdateName = gql(/* GraphQL */ `
  mutation UpdateName($name: String!) {
    accountUpdateName(name: $name) {
      name
    }
  }
`)

export function useUpdateName({
  options,
}: {
  options?: UseMutationOptions<
    UpdateNameMutation['accountUpdateName'],
    AppwriteException,
    UpdateNameMutationVariables,
    string[]
  >
}) {
  const { graphql } = useAppwrite()

  const queryResult = useMutation({
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
    ...options,
  })

  return { ...queryResult }
}
