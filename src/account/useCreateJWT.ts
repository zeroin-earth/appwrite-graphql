import type { ResultOf } from 'gql.tada'
import { graphql as gql } from 'gql.tada'

import { Keys } from '../query/Keys'
import type { AppwriteException } from '../types'
import { useAppwrite } from '../useAppwrite'
import { useMutation } from '../useMutation'
import { useQueryClient } from '../useQueryClient'
import { useSuspenseQuery } from '../useSuspenseQuery'

//The documentation says there should be a duration parameter, but including one causes a server error.
const accountCreateJWT = gql(/* GraphQL */ `
  mutation CreateJWT {
    accountCreateJWT {
      jwt
    }
  }
`)

type Result = ResultOf<typeof accountCreateJWT>['accountCreateJWT']

export function useCreateJWT({ gcTime = 600000 }: { gcTime?: number } = {}) {
  const { graphql } = useAppwrite()
  const queryClient = useQueryClient()

  const queryResult = useMutation<Result, AppwriteException[], void>({
    gcTime,
    mutationKey: Keys.account().jwt().create(),
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
      graphql.client.setJWT(data.jwt)
      queryClient.setQueryData(Keys.account().jwt().create(), data.jwt, { updatedAt: Date.now() })
    },
  })

  return { ...queryResult }
}

export function useSuspenseCreateJWT({ gcTime = 600000 }: { gcTime?: number } = {}) {
  const { graphql } = useAppwrite()

  const queryResult = useSuspenseQuery<Result, AppwriteException[], Result>({
    gcTime,
    queryKey: Keys.account().jwt().create(),
    queryFn: async () => {
      const { data, errors } = await graphql.mutation({
        query: accountCreateJWT,
      })

      if (errors) {
        throw errors
      }

      graphql.client.setJWT(data.accountCreateJWT.jwt)
      return data.accountCreateJWT
    },
  })

  return { ...queryResult }
}
