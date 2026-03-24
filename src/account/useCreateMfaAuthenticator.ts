import type { ResultOf } from 'gql.tada'
import { graphql as gql } from 'gql.tada'

import { Keys } from '../query/Keys'
import type { AppwriteException, Prettify } from '../types'
import { AuthenticatorType } from '../types'
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

type Vars = {
  /** The authenticator type. Defaults to `AuthenticatorType.Totp`. */
  type?: AuthenticatorType
}
/** The variables accepted by the {@link useCreateMfaAuthenticator} mutation. */
export type CreateMfaAuthenticatorVariables = Prettify<Vars>
/** The result returned by the {@link useCreateMfaAuthenticator} mutation. */
export type CreateMfaAuthenticatorResult = Prettify<
  ResultOf<typeof accountCreateMfaAuthenticator>['accountCreateMfaAuthenticator']
>

/**
 * Mutation to create an MFA authenticator (e.g., TOTP).
 *
 * Returns a `secret` and `uri` that can be used to generate a QR code
 * for the user to scan with an authenticator app. The authenticator must
 * be verified with {@link useUpdateMfaAuthenticator} before it becomes active.
 * Invalidates MFA authenticator queries on success.
 *
 * @example
 * ```tsx
 * import { AuthenticatorType } from '@zeroin.earth/appwrite-graphql'
 *
 * const { mutate, data, isPending } = useCreateMfaAuthenticator()
 *
 * mutate({ type: AuthenticatorType.Totp })
 *
 * // Use data.uri to generate a QR code
 * // Use data.secret as a manual entry fallback
 * ```
 *
 * **Variables** ({@link CreateMfaAuthenticatorVariables}):
 * - `type` — The authenticator type ({@link AuthenticatorType}). Defaults to `AuthenticatorType.Totp`.
 *
 * @returns A `UseMutationResult` with the authenticator's `secret` and `uri` for QR code generation.
 */
export function useCreateMfaAuthenticator() {
  const { graphql } = useAppwrite()
  const queryClient = useQueryClient()

  const queryResult = useMutation<
    CreateMfaAuthenticatorResult,
    AppwriteException[],
    CreateMfaAuthenticatorVariables
  >({
    mutationKey: Keys.account().mfaAuthenticator().create(),
    mutationFn: async ({ type = AuthenticatorType.Totp }) => {
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
      void queryClient.invalidateQueries({
        queryKey: Keys.account().mfaAuthenticator().key(),
      })
    },
  })

  return queryResult
}
