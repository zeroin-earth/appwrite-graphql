import { AppwriteException } from 'appwrite'

import { gql } from '../__generated__'
import { UpdatePhoneMutation, UpdatePhoneMutationVariables } from '../__generated__/graphql'
import { useAppwrite } from '../useAppwrite'
import { useMutation } from '../useMutation'

const accountUpdatePhone = gql(/* GraphQL */ `
  mutation UpdatePhone($phone: String!, $password: String!) {
    accountUpdatePhone(phone: $phone, password: $password) {
      phone
    }
  }
`)

export function useUpdatePhone() {
  const { graphql } = useAppwrite()

  const queryResult = useMutation<
    UpdatePhoneMutation['accountUpdatePhone'],
    AppwriteException[],
    UpdatePhoneMutationVariables
  >({
    mutationFn: async ({ phone, password }) => {
      const { data, errors } = await graphql.mutation({
        query: accountUpdatePhone,
        variables: {
          phone,
          password,
        },
      })

      if (errors) {
        throw errors
      }

      return data.accountUpdatePhone
    },
  })

  return { ...queryResult }
}
