import { AppwriteException } from 'appwrite'

import { gql } from '../__generated__'
import { UpdateSessionMutation, UpdateSessionMutationVariables } from '../__generated__/graphql'
import { useAppwrite } from '../useAppwrite'
import { useMutation } from '../useMutation'

const updateSession = gql(/* GraphQL */ `
  mutation UpdateSession($sessionId: String!) {
    accountUpdateSession(sessionId: $sessionId) {
      userId
      expire
      current
    }
  }
`)

export function useUpdateSession() {
  const { graphql } = useAppwrite()

  const queryResult = useMutation<
    UpdateSessionMutation['accountUpdateSession'],
    AppwriteException,
    UpdateSessionMutationVariables
  >({
    mutationFn: async ({ sessionId }) => {
      const { data, errors } = await graphql.mutation({
        query: updateSession,
        variables: {
          sessionId,
        },
      })

      if (errors) {
        throw errors
      }

      return data.accountUpdateSession
    },
  })

  return { ...queryResult }
}
