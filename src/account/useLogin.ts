import { AppwriteException } from 'appwrite'

import { gql } from '../__generated__/gql'
import { Session } from '../__generated__/graphql'
import { useAppwrite } from '../useAppwrite'
import { useMutation } from '../useMutation'

type LoginProps = {
  email: string
  password: string
}

type OAuthLoginProps = {
  provider: string
  success: string
  failure: string
}

const createEmailSession = gql(/* GraphQL */ `
  mutation CreateEmailSession($email: String!, $password: String!) {
    accountCreateEmailSession(email: $email, password: $password) {
      userId
      expire
      current
    }
  }
`)

export function useLogin() {
  const { account, graphql } = useAppwrite()

  const login = useMutation<Session, AppwriteException, LoginProps, unknown>({
    mutationFn: async ({ email, password }) => {
      const { data, errors } = await graphql.mutation({
        query: createEmailSession,
        variables: {
          email,
          password,
        },
      })

      if (errors) {
        throw errors
      }

      return data.accountCreateEmailSession ?? ({} as Session)
    },
  })

  const oAuthLogin = useMutation<void | URL, AppwriteException, OAuthLoginProps, unknown>({
    mutationFn: async ({ provider, success, failure }) => {
      return account.createOAuth2Session(provider, success, failure)
    },
  })

  return {
    login,
    oAuthLogin,
  }
}
