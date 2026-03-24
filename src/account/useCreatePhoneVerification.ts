import type { ResultOf } from 'gql.tada'
import { graphql as gql } from 'gql.tada'

import { Keys } from '../query/Keys'
import type { AppwriteException, Prettify } from '../types'
import { useAppwrite } from '../useAppwrite'
import { useMutation } from '../useMutation'

const createPhoneVerification = gql(/* GraphQL */ `
  mutation CreatePhoneVerification {
    accountCreatePhoneVerification {
      expire
    }
  }
`)

/** The result returned by the {@link useCreatePhoneVerification} mutation. */
export type CreatePhoneVerificationResult = Prettify<
  ResultOf<typeof createPhoneVerification>['accountCreatePhoneVerification']
>

/**
 * Mutation to send a phone verification SMS to the current user.
 *
 * Sends a verification code to the phone number associated with the
 * currently authenticated user. Complete the verification with
 * {@link useUpdatePhoneVerification}.
 *
 * @example
 * ```tsx
 * const { mutate, isPending } = useCreatePhoneVerification()
 *
 * mutate()
 * ```
 *
 * This mutation takes no variables.
 *
 * @returns A `UseMutationResult` with the verification's `expire` timestamp.
 */
export function useCreatePhoneVerification() {
  const { graphql } = useAppwrite()

  const queryResult = useMutation<CreatePhoneVerificationResult, AppwriteException[], void>({
    mutationKey: Keys.account().phoneVerification().create(),
    mutationFn: async () => {
      const { data, errors } = await graphql.mutation({
        query: createPhoneVerification,
      })

      if (errors) {
        throw errors
      }

      return data.accountCreatePhoneVerification
    },
  })

  return queryResult
}
