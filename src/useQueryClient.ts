import { useAtomValue } from 'jotai'

import { QueryAtom } from './states/query'

export function useQueryClient() {
  return useAtomValue(QueryAtom)
}
