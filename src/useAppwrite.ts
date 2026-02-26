import { useAtomValue } from 'jotai'

import { appwriteAtom } from './states/appwrite'

export function useAppwrite() {
  const { account, avatars, databases, realtime, storage, graphql } = useAtomValue(appwriteAtom)

  return {
    account,
    avatars,
    databases,
    realtime,
    storage,
    graphql,
  }
}
