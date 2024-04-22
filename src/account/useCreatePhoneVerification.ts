import { AppwriteException } from 'appwrite'

import { gql } from '../__generated__'
import { CreatePhoneVerificationMutation } from '../__generated__/graphql'
import { useAppwrite } from '../useAppwrite'
import { useMutation } from '../useMutation'

const createPhoneVerification = gql(/* GraphQL */ `
  mutation CreatePhoneVerification {
    accountCreatePhoneVerification {
      expire
    }
  }
`)

export function useCreatePhoneVerification() {
  const { graphql } = useAppwrite()

  const queryResult = useMutation<
    CreatePhoneVerificationMutation['accountCreatePhoneVerification'],
    AppwriteException,
    void
  >({
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

  return { ...queryResult }
}
