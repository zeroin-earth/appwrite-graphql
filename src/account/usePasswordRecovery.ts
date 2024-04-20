import { UseMutationOptions } from '@tanstack/react-query'
import { AppwriteException } from 'appwrite'

import { gql } from '../__generated__'
import { CreateRecoveryMutation, CreateRecoveryMutationVariables } from '../__generated__/graphql'
import { useAppwrite } from '../useAppwrite'
import { useMutation } from '../useMutation'

const createRecovery = gql(/* GraphQL */ `
  mutation CreateRecovery($email: String!, $url: String!) {
    accountCreateRecovery(email: $email, url: $url) {
      expire
    }
  }
`)

/**
 * Send the recovery email to the address supplied
 */
export function usePasswordRecovery({
  options,
}: {
  options?: UseMutationOptions<
    CreateRecoveryMutation['accountCreateRecovery'],
    AppwriteException,
    CreateRecoveryMutationVariables,
    string[]
  >
}) {
  const { graphql } = useAppwrite()

  const queryResult = useMutation({
    mutationFn: async ({ email, url: resetUrl }) => {
      const { data, errors } = await graphql.mutation({
        query: createRecovery,
        variables: {
          email,
          url: resetUrl,
        },
      })

      if (errors) {
        throw errors
      }

      return data.accountCreateRecovery
    },
    ...options,
    onSuccess: async (token, variables, context) => {
      localStorage.setItem('email', variables.email)
      options?.onSuccess?.(token, variables, context)
    },
  })

  return { ...queryResult }
}
