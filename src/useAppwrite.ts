import { useAtomValue } from 'jotai'

import { appwriteAtom } from './states/appwrite'

export function useAppwrite() {
  const { account, avatars, realtime, storage, graphql } = useAtomValue(appwriteAtom)

  return {
    avatars,
    realtime,
    storage,
    account,
    graphql,
  }
}
