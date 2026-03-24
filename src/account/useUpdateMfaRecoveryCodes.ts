import type { ResultOf } from 'gql.tada'
import { graphql as gql } from 'gql.tada'

import { Keys } from '../query/Keys'
import type { AppwriteException, Prettify } from '../types'
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

/** The result returned by the {@link useUpdateMfaRecoveryCodes} mutation. */
export type UpdateMfaRecoveryCodesResult = Prettify<
  ResultOf<typeof accountUpdateMfaRecoveryCodes>['accountUpdateMfaRecoveryCodes']
>

/**
 * Mutation hook to regenerate MFA recovery codes.
 *
 * Replaces the existing set of recovery codes with new ones. Previous
 * recovery codes will no longer be valid. Invalidates recovery code
 * queries on success.
 *
 * @example
 * ```tsx
 * const { mutate, data, isPending } = useUpdateMfaRecoveryCodes()
 *
 * mutate()
 *
 * // Display data.recoveryCodes to the user for safekeeping
 * ```
 *
 * This mutation takes no variables.
 *
 * @returns A `UseMutationResult` with a `recoveryCodes` array of new backup codes.
 */
export function useUpdateMfaRecoveryCodes() {
  const { graphql } = useAppwrite()
  const queryClient = useQueryClient()

  const queryResult = useMutation<UpdateMfaRecoveryCodesResult, AppwriteException[], void>({
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

  return queryResult
}
