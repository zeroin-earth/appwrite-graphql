import type { ResultOf } from 'gql.tada'
import { graphql as gql } from 'gql.tada'

import { Keys } from '../query/Keys'
import type { AppwriteException } from '../types'
import { useAppwrite } from '../useAppwrite'
import { useMutation } from '../useMutation'
import { useQueryClient } from '../useQueryClient'

const accountUpdateMfaRecoveryCodes = gql(/* GraphQL */ `
  mutation UpdateMfaRecoveryCodes {
    accountUpdateMfaRecoveryCodes {
      recoveryCodes
    }
  }
`)

type Result = ResultOf<typeof accountUpdateMfaRecoveryCodes>['accountUpdateMfaRecoveryCodes']

export function useUpdateMfaRecoveryCodes() {
  const { graphql } = useAppwrite()
  const queryClient = useQueryClient()

  const queryResult = useMutation<Result, AppwriteException[], void>({
    mutationKey: Keys.account().mfaCodes().update(),
    mutationFn: async () => {
      const { data, errors } = await graphql.mutation({
        query: accountUpdateMfaRecoveryCodes,
      })

      if (errors) {
        throw errors
      }

      return data.accountUpdateMfaRecoveryCodes
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: Keys.account().mfaCodes().key(),
      })
    },
  })

  return { ...queryResult }
}
