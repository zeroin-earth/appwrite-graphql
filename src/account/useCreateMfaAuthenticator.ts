import type { ResultOf, VariablesOf } from 'gql.tada'
import { graphql as gql } from 'gql.tada'

import { Keys } from '../query/Keys'
import type { AppwriteException } from '../types'
import { useAppwrite } from '../useAppwrite'
import { useMutation } from '../useMutation'
import { useQueryClient } from '../useQueryClient'

const accountCreateMfaAuthenticator = gql(/* GraphQL */ `
  mutation CreateMfaAuthenticator($type: String!) {
    accountCreateMfaAuthenticator(type: $type) {
      secret
      uri
    }
  }
`)

type Variables = VariablesOf<typeof accountCreateMfaAuthenticator>
type Result = ResultOf<typeof accountCreateMfaAuthenticator>['accountCreateMfaAuthenticator']

export function useCreateMfaAuthenticator() {
  const { graphql } = useAppwrite()
  const queryClient = useQueryClient()

  const queryResult = useMutation<Result, AppwriteException[], Variables>({
    mutationKey: Keys.account().mfaAuthenticator().create(),
    mutationFn: async ({ type = 'totp' }) => {
      const { data, errors } = await graphql.mutation({
        query: accountCreateMfaAuthenticator,
        variables: {
          type,
        },
      })

      if (errors) {
        throw errors
      }

      return data.accountCreateMfaAuthenticator
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: Keys.account().mfaAuthenticator().key() })
    },
  })

  return { ...queryResult }
}
