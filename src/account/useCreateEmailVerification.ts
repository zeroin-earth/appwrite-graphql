import { gql } from '../__generated__'
import type {
  CreateEmailVerificationMutation,
  CreateEmailVerificationMutationVariables,
} from '../__generated__/graphql'
import type { AppwriteException } from '../types'
import { useAppwrite } from '../useAppwrite'
import { useMutation } from '../useMutation'

const createEmailVerification = gql(/* GraphQL */ `
  mutation CreateEmailVerification($url: String!) {
    accountCreateEmailVerification(url: $url) {
      _id
      userId
      secret
      expire
    }
  }
`)

export function useCreateEmailVerification() {
  const { graphql } = useAppwrite()

  const queryResult = useMutation<
    CreateEmailVerificationMutation['accountCreateEmailVerification'],
    AppwriteException[],
    CreateEmailVerificationMutationVariables
  >({
    mutationFn: async ({ url }) => {
      const { data, errors } = await graphql.mutation({
        query: createEmailVerification,
        variables: { url },
      })

      if (errors) {
        throw errors
      }

      return data.accountCreateEmailVerification
    },
  })

  return { ...queryResult }
}
