import { AppwriteException, OAuthProvider, Models } from 'appwrite'

import { gql } from '../__generated__/gql'
// import { Session } from '../__generated__/graphql'
import { useAppwrite } from '../useAppwrite'
import { useMutation } from '../useMutation'

type LoginProps = {
  email: string
  password: string
}

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

  const login = useMutation<Models.Session, AppwriteException, LoginProps, unknown>({
    mutationFn: async ({ email, password }) => {
      // const { data, errors } = await graphql.mutation({
      //   query: accountCreateEmailPasswordSession,
      //   variables: {
      //     email,
      //     password,
      //   },
      // })

      return await account.createEmailPasswordSession(email, password)

      // if (errors) {
      //   throw errors
      // }

      // return data.accountCreateEmailSession ?? ({} as Session)
    },
  })

  const oAuthLogin = useMutation<void | URL, AppwriteException, OAuthLoginProps, unknown>({
    mutationFn: async ({ provider, success, failure }) => {
      return account.createOAuth2Session(provider, success, failure)
    },
  })

  return {
    login: {
      context: login.context,
      data: login.data,
      error: login.error,
      failureCount: login.failureCount,
      failureReason: login.failureReason,
      isError: login.isError,
      isIdle: login.isIdle,
      isPaused: login.isPaused,
      isPending: login.isPending,
      isSuccess: login.isSuccess,
      mutate: login.mutate,
      mutateAsync: login.mutateAsync,
      reset: login.reset,
      status: login.status,
      submittedAt: login.submittedAt,
      variables: login.variables,
    },
    oAuthLogin: {
      context: oAuthLogin.context,
      data: oAuthLogin.data,
      error: oAuthLogin.error,
      failureCount: oAuthLogin.failureCount,
      failureReason: oAuthLogin.failureReason,
      isError: oAuthLogin.isError,
      isIdle: oAuthLogin.isIdle,
      isPaused: oAuthLogin.isPaused,
      isPending: oAuthLogin.isPending,
      isSuccess: oAuthLogin.isSuccess,
      mutate: oAuthLogin.mutate,
      mutateAsync: oAuthLogin.mutateAsync,
      reset: oAuthLogin.reset,
      status: oAuthLogin.status,
      submittedAt: oAuthLogin.submittedAt,
      variables: oAuthLogin.variables,
    },
  }
}
