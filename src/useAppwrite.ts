import { useAtomValue } from 'jotai'

import { appwriteAtom } from './states/appwrite'

export function useAppwrite() {
  return useAtomValue(appwriteAtom)
}
