import type { ResultOf } from 'gql.tada'
import { graphql as gql } from 'gql.tada'

import { Keys } from '../query/Keys'
import type { AppwriteException, Prettify } from '../types'
import { AuthenticatorType } from '../types'
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

type Vars = {
  /** The authenticator type to delete. Defaults to `AuthenticatorType.Totp`. */
  type?: AuthenticatorType
}
/** The variables accepted by the {@link useDeleteMfaAuthenticator} mutation. */
export type DeleteMfaAuthenticatorVariables = Prettify<Vars>
/** The result returned by the {@link useDeleteMfaAuthenticator} mutation. */
export type DeleteMfaAuthenticatorResult = Prettify<
  ResultOf<typeof deleteMFAAuthenticator>['accountDeleteMfaAuthenticator']
>

/**
 * Mutation hook to delete an MFA authenticator by type (defaults to `"totp"`).
 *
 * Removes the specified authenticator from the user's account. Invalidates
 * account and MFA authenticator queries on success.
 *
 * @example
 * ```tsx
 * import { AuthenticatorType } from '@zeroin.earth/appwrite-graphql'
 *
 * const { mutate, isPending } = useDeleteMfaAuthenticator()
 *
 * mutate({ type: AuthenticatorType.Totp })
 * ```
 *
 * **Variables** ({@link DeleteMfaAuthenticatorVariables}):
 * - `type` — The authenticator type to delete ({@link AuthenticatorType}). Defaults to `AuthenticatorType.Totp`.
 *
 * @returns A `UseMutationResult` with a `status` string indicating the operation result.
 */
export function useDeleteMfaAuthenticator() {
  const { graphql } = useAppwrite()
  const queryClient = useQueryClient()

  const queryResult = useMutation<
    DeleteMfaAuthenticatorResult,
    AppwriteException[],
    DeleteMfaAuthenticatorVariables
  >({
    mutationKey: Keys.account().mfaAuthenticator().delete(),
    mutationFn: async ({ type = AuthenticatorType.Totp }) => {
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

  return queryResult
}
