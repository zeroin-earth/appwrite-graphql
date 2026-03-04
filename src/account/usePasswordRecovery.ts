import type { ResultOf, VariablesOf } from 'gql.tada'
import { graphql as gql } from 'gql.tada'

import { Keys } from '../query/Keys'
import type { AppwriteException } from '../types'
import { useAppwrite } from '../useAppwrite'
import { useMutation } from '../useMutation'

const createRecovery = gql(/* GraphQL */ `
  mutation CreateRecovery($email: String!, $url: String!) {
    accountCreateRecovery(email: $email, url: $url) {
      expire
    }
  }
`)

type Variables = VariablesOf<typeof createRecovery>
type Result = ResultOf<typeof createRecovery>['accountCreateRecovery']

/**
 * Send the recovery email to the address supplied
 */
export function usePasswordRecovery() {
  const { graphql } = useAppwrite()

  const queryResult = useMutation<Result, AppwriteException[], Variables>({
    mutationKey: Keys.account().recovery().create(),
    mutationFn: async ({ email, url: resetUrl }) => {
      const { data, errors } = await graphql.mutation({
        query: createRecovery,
        variables: {
          email,
          url: resetUrl,
        },
      })

      if (errors) {
        throw errors
      }

      return data.accountCreateRecovery
    },
    onSuccess: async (_, variables) => {
      try {
        localStorage?.setItem('email', variables.email)
      } catch (e: any) {
        console.error(
          'Could not save email to local storage. If you are using react-native, this is expected.',
          e,
        )
      }
    },
  })

  return { ...queryResult }
}
