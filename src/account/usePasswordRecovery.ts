import { AppwriteException } from '../types'

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
export function usePasswordRecovery() {
  const { graphql } = useAppwrite()

  const queryResult = useMutation<
    CreateRecoveryMutation['accountCreateRecovery'],
    AppwriteException[],
    CreateRecoveryMutationVariables
  >({
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
    onSuccess: async (_, variables) => {
      localStorage.setItem('email', variables.email)
    },
  })

  return { ...queryResult }
}
