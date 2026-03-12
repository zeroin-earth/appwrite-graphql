import type { ResultOf, VariablesOf } from 'gql.tada'
import { graphql as gql } from 'gql.tada'

import { Keys } from '../query/Keys'
import type { AppwriteException } from '../types'
import { useAppwrite } from '../useAppwrite'
import { useMutation } from '../useMutation'
import { useQueryClient } from '../useQueryClient'

const deleteMFAAuthenticator = gql(/* GraphQL */ `
  mutation DeleteMfaAuthenticator($type: String!) {
    accountDeleteMfaAuthenticator(type: $type) {
      status
    }
  }
`)

type Variables = VariablesOf<typeof deleteMFAAuthenticator>
type Result = ResultOf<typeof deleteMFAAuthenticator>['accountDeleteMfaAuthenticator']

export function useDeleteMfaAuthenticator() {
  const { graphql } = useAppwrite()
  const queryClient = useQueryClient()

  const queryResult = useMutation<Result, AppwriteException[], Variables>({
    mutationKey: Keys.account().mfaAuthenticator().delete(),
    mutationFn: async ({ type = 'totp' }) => {
      const { data, errors } = await graphql.mutation({
        query: deleteMFAAuthenticator,
        variables: {
          type,
        },
      })

      if (errors) {
        throw errors
      }

      return data?.accountDeleteMfaAuthenticator ?? { status: '' }
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: Keys.account().key() })
      void queryClient.invalidateQueries({
        queryKey: Keys.account().mfaAuthenticator().key(),
      })
    },
  })

  return { ...queryResult }
}
