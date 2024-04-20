import { UseMutationOptions } from '@tanstack/react-query'
import { AppwriteException } from 'appwrite'

import { gql } from '../__generated__'
import { DeleteIdentityMutation, DeleteIdentityMutationVariables } from '../__generated__/graphql'
import { useAppwrite } from '../useAppwrite'
import { useMutation } from '../useMutation'

const accountDeleteIdentity = gql(/* GraphQL */ `
  mutation DeleteIdentity($identityId: String!) {
    accountDeleteIdentity(identityId: $identityId) {
      status
    }
  }
`)

export function useDeleteIdentity({
  options,
}: {
  options?: UseMutationOptions<
    DeleteIdentityMutation['accountDeleteIdentity'],
    AppwriteException,
    DeleteIdentityMutationVariables,
    string[]
  >
}) {
  const { graphql } = useAppwrite()

  const queryResult = useMutation({
    mutationFn: async ({ identityId }) => {
      const { data, errors } = await graphql.mutation({
        query: accountDeleteIdentity,
        variables: {
          identityId,
        },
      })

      if (errors) {
        throw errors
      }

      return data.accountDeleteIdentity ?? { status: false }
    },
    ...options,
  })

  return { ...queryResult }
}
