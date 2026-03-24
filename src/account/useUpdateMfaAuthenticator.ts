import type { ResultOf } from 'gql.tada'
import { graphql as gql } from 'gql.tada'

import { Keys } from '../query/Keys'
import type { AppwriteException, Prettify } from '../types'
import { AuthenticatorType } from '../types'
import { useAppwrite } from '../useAppwrite'
import { useMutation } from '../useMutation'
import { useQueryClient } from '../useQueryClient'

const updateMFAAuthenticator = gql(/* GraphQL */ `
  mutation UpdateMfaAuthenticator($type: String!, $otp: String!) {
    accountUpdateMfaAuthenticator(type: $type, otp: $otp) {
      mfa
    }
  }
`)

/** The variables accepted by the {@link useUpdateMfaAuthenticator} mutation. */
export type UpdateMfaAuthenticatorVariables = {
  /** The authenticator type. Defaults to `AuthenticatorType.Totp`. */
  type?: AuthenticatorType
  /** The one-time password from the authenticator app. */
  otp: string
}
/** The result returned by the {@link useUpdateMfaAuthenticator} mutation. */
export type UpdateMfaAuthenticatorResult = Prettify<
  ResultOf<typeof updateMFAAuthenticator>['accountUpdateMfaAuthenticator']
>

/**
 * Mutation hook to verify an MFA authenticator by providing a `type` and `otp` code.
 *
 * Completes the MFA authenticator setup started by
 * {@link useCreateMfaAuthenticator}. The user must enter the OTP from
 * their authenticator app to confirm enrollment. Invalidates account
 * and MFA factor queries on success.
 *
 * @example
 * ```tsx
 * import { AuthenticatorType } from '@zeroin.earth/appwrite-graphql'
 *
 * const { mutate, isPending } = useUpdateMfaAuthenticator()
 *
 * mutate({
 *   type: AuthenticatorType.Totp,
 *   otp: '123456',
 * })
 * ```
 *
 * **Variables** ({@link UpdateMfaAuthenticatorVariables}):
 * - `type` — The authenticator type ({@link AuthenticatorType}). Defaults to `AuthenticatorType.Totp`.
 * - `otp` — The one-time password from the authenticator app
 *
 * @returns A `UseMutationResult` with the updated `mfa` boolean status.
 */
export function useUpdateMfaAuthenticator() {
  const { graphql } = useAppwrite()
  const queryClient = useQueryClient()

  const queryResult = useMutation<
    UpdateMfaAuthenticatorResult,
    AppwriteException[],
    UpdateMfaAuthenticatorVariables
  >({
    mutationKey: Keys.account().mfaAuthenticator().update(),
    mutationFn: async ({ type = AuthenticatorType.Totp, otp }) => {
      const { data, errors } = await graphql.mutation({
        query: updateMFAAuthenticator,
        variables: {
          type,
          otp,
        },
      })

      if (errors) {
        throw errors
      }

      return data.accountUpdateMfaAuthenticator
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
