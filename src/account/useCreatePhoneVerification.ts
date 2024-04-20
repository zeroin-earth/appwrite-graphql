import { UseMutationOptions } from '@tanstack/react-query'
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

export function useCreatePhoneVerification({
  options,
}: {
  options?: UseMutationOptions<
    CreatePhoneVerificationMutation['accountCreatePhoneVerification'],
    AppwriteException,
    void,
    string[]
  >
}) {
  const { graphql } = useAppwrite()

  const queryResult = useMutation({
    mutationFn: async () => {
      const { data, errors } = await graphql.mutation({
        query: createPhoneVerification,
      })

      if (errors) {
        throw errors
      }

      return data.accountCreatePhoneVerification
    },
    ...options,
  })

  return { ...queryResult }
}
