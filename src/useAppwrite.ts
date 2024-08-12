import { useAtomValue } from 'jotai'

import { appwriteAtom } from './states/appwrite'

export function useAppwrite() {
  const { account, databases, graphql } = useAtomValue(appwriteAtom)

  return {
    account,
    databases,
    graphql,
  }
}
