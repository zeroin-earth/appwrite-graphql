import { AppwriteException } from 'appwrite'

import { gql } from '../__generated__'
import { CreateJwtMutation } from '../__generated__/graphql'
import { useAppwrite } from '../useAppwrite'
import { useMutation } from '../useMutation'
import { useQueryClient } from '../useQueryClient'
import { useSuspenseQuery } from '../useSuspenseQuery'

const accountCreateJWT = gql(/* GraphQL */ `
  mutation CreateJWT {
    accountCreateJWT {
      jwt
    }
  }
`)

export function useCreateJWT({ gcTime = 600000 }: { gcTime?: number } = {}) {
  const { graphql } = useAppwrite()
  const queryClient = useQueryClient()

  const queryResult = useMutation<CreateJwtMutation['accountCreateJWT'], AppwriteException>({
    gcTime,
    mutationKey: ['appwrite', 'jwt'],
    mutationFn: async () => {
      const { data, errors } = await graphql.mutation({
        query: accountCreateJWT,
      })

      if (errors) {
        throw errors
      }

      return data.accountCreateJWT
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['appwrite', 'jwt'], data.jwt, { updatedAt: Date.now() })
    },
  })

  return { ...queryResult }
}

export function useSuspenseCreateJWT({ gcTime = 600000 }: { gcTime?: number } = {}) {
  const { graphql } = useAppwrite()

  const queryResult = useSuspenseQuery<
    CreateJwtMutation['accountCreateJWT'],
    AppwriteException,
    CreateJwtMutation['accountCreateJWT']
  >({
    gcTime,
    queryKey: ['appwrite', 'jwt'],
    queryFn: async () => {
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
