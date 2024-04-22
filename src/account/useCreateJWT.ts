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

export function useCreateJWT() {
  const { graphql } = useAppwrite()

  const queryResult = useMutation<
    CreateJwtMutation['accountCreateJWT'],
    AppwriteException,
    CreateJwtMutationVariables
  >({
    mutationFn: async () => {
      const { data, errors } = await graphql.mutation({
        query: accountCreateJWT,
      })

      if (errors) {
        throw errors
      }

      return data.accountCreateJWT
    },
  })

  return { ...queryResult }
}
