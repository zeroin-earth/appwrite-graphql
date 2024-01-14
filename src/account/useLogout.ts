import { gql } from '../__generated__'
import { useAppwrite } from '../useAppwrite'
import { useMutation } from '../useMutation'
import { useQueryClient } from '../useQueryClient'

const deleteSession = gql(/* GraphQL */ `
  mutation DeleteSession($sessionId: String!) {
    accountDeleteSession(sessionId: $sessionId) {
      status
    }
  }
`)

export function useLogout() {
  const { graphql } = useAppwrite()
  const queryClient = useQueryClient()

  const logout = useMutation({
    mutationFn: () => {
      return graphql.mutation({
        query: deleteSession,
        variables: {
          sessionId: 'current',
        },
      })
    },

    onSuccess: async () => {
      queryClient.setQueryData(['appwrite', 'account'], null)
      queryClient.removeQueries({ queryKey: ['appwrite', 'account'] })
    },
  })

  return logout
}
