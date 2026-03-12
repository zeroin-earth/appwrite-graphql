import type { ResultOf } from 'gql.tada'
import { graphql as gql } from 'gql.tada'

import { Keys } from '../query/Keys'
import type { AppwriteException } from '../types'
import { useAppwrite } from '../useAppwrite'
import { useMutation } from '../useMutation'
import { useQueryClient } from '../useQueryClient'

const accountCreateMfaRecoveryCodes = gql(/* GraphQL */ `
  mutation CreateMfaRecoveryCodes {
    accountCreateMfaRecoveryCodes {
      recoveryCodes
    }
  }
`)

type Result = ResultOf<typeof accountCreateMfaRecoveryCodes>['accountCreateMfaRecoveryCodes']

export function useCreateMfaRecoveryCodes() {
  const { graphql } = useAppwrite()
  const queryClient = useQueryClient()

  const queryResult = useMutation<Result, AppwriteException[], void>({
    mutationKey: Keys.account().mfaCodes().create(),
    mutationFn: async () => {
      const { data, errors } = await graphql.mutation({
        query: accountCreateMfaRecoveryCodes,
      })

      if (errors) {
        throw errors
      }

      return data.accountCreateMfaRecoveryCodes
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: Keys.account().mfaCodes().key(),
      })
    },
  })

  return { ...queryResult }
}
