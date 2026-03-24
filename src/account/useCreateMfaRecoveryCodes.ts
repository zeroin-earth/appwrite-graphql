import type { ResultOf } from 'gql.tada'
import { graphql as gql } from 'gql.tada'

import { Keys } from '../query/Keys'
import type { AppwriteException, Prettify } from '../types'
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

/** The result returned by the {@link useCreateMfaRecoveryCodes} mutation. */
export type CreateMfaRecoveryCodesResult = Prettify<
  ResultOf<typeof accountCreateMfaRecoveryCodes>['accountCreateMfaRecoveryCodes']
>

/**
 * Mutation to generate MFA recovery codes.
 *
 * Generates a new set of recovery codes that can be used as a backup
 * when the primary MFA method is unavailable. Invalidates recovery code
 * queries on success. Use {@link useUpdateMfaRecoveryCodes} to regenerate codes.
 *
 * @example
 * ```tsx
 * const { mutate, data, isPending } = useCreateMfaRecoveryCodes()
 *
 * mutate()
 *
 * // Display data.recoveryCodes to the user for safekeeping
 * ```
 *
 * This mutation takes no variables.
 *
 * @returns A `UseMutationResult` with a `recoveryCodes` array of backup codes.
 */
export function useCreateMfaRecoveryCodes() {
  const { graphql } = useAppwrite()
  const queryClient = useQueryClient()

  const queryResult = useMutation<CreateMfaRecoveryCodesResult, AppwriteException[], void>({
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

  return queryResult
}
