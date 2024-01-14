import { AppwriteException } from 'appwrite'

import { gql } from '../__generated__'
import { Token } from '../__generated__/graphql'
import { useAppwrite } from '../useAppwrite'
import { useMutation } from '../useMutation'

type Props = {
  email: string
  resetUrl: string
}

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

  const passwordRecovery = useMutation<Token, AppwriteException, Props, unknown>({
    mutationFn: async ({ email, resetUrl }) => {
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

      return data.accountCreateRecovery ?? ({} as Token)
    },

    onSuccess: async (_, variables) => {
      localStorage.setItem('email', variables.email)
    },
  })

  return passwordRecovery
}
