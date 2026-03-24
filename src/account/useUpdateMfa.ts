import type { ResultOf, VariablesOf } from 'gql.tada'
import { graphql as gql } from 'gql.tada'

import { Keys } from '../query/Keys'
import type { AppwriteException, Prettify } from '../types'
import { useAppwrite } from '../useAppwrite'
import { useMutation } from '../useMutation'
import { useQueryClient } from '../useQueryClient'

const accountUpdateMFA = gql(/* GraphQL */ `
  mutation UpdateMFA($mfa: Boolean!) {
    accountUpdateMFA(mfa: $mfa) {
      mfa
    }
  }
`)

/** The variables accepted by the {@link useUpdateMfa} mutation. */
export type UpdateMfaVariables = Prettify<VariablesOf<typeof accountUpdateMFA>>
/** The result returned by the {@link useUpdateMfa} mutation. */
export type UpdateMfaResult = Prettify<ResultOf<typeof accountUpdateMFA>['accountUpdateMFA']>

/**
 * Mutation hook to enable or disable MFA on the current account.
 *
 * Toggles multi-factor authentication for the user. Invalidates account
 * and MFA factor queries on success.
 *
 * @example
 * ```tsx
 * const { mutate, isPending } = useUpdateMfa()
 *
 * // Enable MFA
 * mutate({ mfa: true })
 *
 * // Disable MFA
 * mutate({ mfa: false })
 * ```
 *
 * **Variables** ({@link UpdateMfaVariables}):
 * - `mfa` — `true` to enable MFA, `false` to disable it
 *
 * @returns A `UseMutationResult` with the updated `mfa` boolean status.
 */
export function useUpdateMfa() {
  const { graphql } = useAppwrite()
  const queryClient = useQueryClient()

  const queryResult = useMutation<UpdateMfaResult, AppwriteException[], UpdateMfaVariables>({
    mutationKey: Keys.account().mfa().update(),
    mutationFn: async ({ mfa }) => {
      const { data, errors } = await graphql.mutation({
        query: accountUpdateMFA,
        variables: {
          mfa,
        },
      })

      if (errors) {
        throw errors
      }

      return data.accountUpdateMFA
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: Keys.account().key() })
      void queryClient.invalidateQueries({
        queryKey: Keys.account().mfaFactors(),
      })
    },
  })

  return queryResult
}
