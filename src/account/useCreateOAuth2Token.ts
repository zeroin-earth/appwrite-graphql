import { Keys } from '../query/Keys'
import type { AppwriteException, OAuthProvider } from '../types'
import { useAppwrite } from '../useAppwrite'
import { useMutation } from '../useMutation'

type OAuthTokenProps = {
  provider: OAuthProvider
  success?: string
  failure?: string
  scopes?: string[]
}

export function useCreateOAuth2Token() {
  const { account } = useAppwrite()

  const queryResult = useMutation<void | string, AppwriteException[], OAuthTokenProps>({
    mutationKey: Keys.account().oauth2Token().create(),
    mutationFn: async ({ provider, success, failure, scopes }) => {
      return account.createOAuth2Token({ provider, success, failure, scopes })
    },
  })

  return { ...queryResult }
}
