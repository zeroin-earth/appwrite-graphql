import { AppwriteException, OAuthProvider } from 'appwrite'

import { gql } from '../__generated__/gql'
import {
  CreateEmailPasswordSessionMutation,
  CreateEmailPasswordSessionMutationVariables,
} from '../__generated__/graphql'
import { useAppwrite } from '../useAppwrite'
import { useMutation } from '../useMutation'

type OAuthLoginProps = {
  provider: OAuthProvider
  success: string
  failure: string
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
  })

  const oAuthLogin = useMutation<void | URL, AppwriteException[], OAuthLoginProps>({
    mutationFn: async ({ provider, success, failure }) => {
      return account.createOAuth2Session(provider, success, failure)
    },
  })

  return {
    login,
    oAuthLogin,
  }
}
