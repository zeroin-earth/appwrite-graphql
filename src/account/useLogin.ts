import { gql } from '../__generated__/gql'
import {
  CreateEmailPasswordSessionMutation,
  CreateEmailPasswordSessionMutationVariables,
} from '../__generated__/graphql'
import { AppwriteException, OAuthProvider } from '../types'
import { useAppwrite } from '../useAppwrite'
import { useMutation } from '../useMutation'
import { useQueryClient } from '../useQueryClient'

type OAuthLoginProps = {
  provider: OAuthProvider
  success?: string
  failure?: string
}

const accountCreateEmailPasswordSession = gql(/* GraphQL */ `
  mutation CreateEmailPasswordSession($email: String!, $password: String!) {
    accountCreateEmailPasswordSession(email: $email, password: $password) {
      userId
      expire
      current
    }
  }
`)

export function useLogin() {
  const { account, graphql } = useAppwrite()
  const queryClient = useQueryClient()

  const login = useMutation<
    CreateEmailPasswordSessionMutation['accountCreateEmailPasswordSession'],
    AppwriteException[],
    CreateEmailPasswordSessionMutationVariables
  >({
    mutationFn: async ({ email, password }) => {
      const { data, errors } = await graphql.mutation({
        query: accountCreateEmailPasswordSession,
        variables: {
          email,
          password,
        },
      })

      if (errors) {
        throw errors
      }

      return data.accountCreateEmailPasswordSession
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appwrite', 'account'] })
      queryClient.invalidateQueries({ queryKey: ['appwrite', 'account', 'sessions'] })
    },
  })

  const oAuthLogin = useMutation<void | string, AppwriteException[], OAuthLoginProps>({
    mutationFn: async ({ provider, success, failure }) => {
      return account.createOAuth2Session({ provider, success, failure })
    },
  })

  return {
    login,
    oAuthLogin,
  }
}
