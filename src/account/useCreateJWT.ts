import { UseMutationOptions } from '@tanstack/react-query'
import { AppwriteException } from 'appwrite'

import { gql } from '../__generated__'
import { CreateJwtMutation, CreateJwtMutationVariables } from '../__generated__/graphql'
import { useAppwrite } from '../useAppwrite'
import { useMutation } from '../useMutation'

const accountCreateJWT = gql(/* GraphQL */ `
  mutation CreateJWT {
    accountCreateJWT {
      jwt
    }
  }
`)

export function useCreateJWT({
  options,
}: {
  options?: UseMutationOptions<
    CreateJwtMutation['accountCreateJWT'],
    AppwriteException,
    CreateJwtMutationVariables,
    string[]
  >
}) {
  const { graphql } = useAppwrite()

  const queryResult = useMutation({
    mutationFn: async () => {
      const { data, errors } = await graphql.mutation({
        query: accountCreateJWT,
      })

      if (errors) {
        throw errors
      }

      return data.accountCreateJWT
    },
    ...options,
  })

  return { ...queryResult }
}
