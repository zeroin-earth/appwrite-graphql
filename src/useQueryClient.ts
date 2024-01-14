import { useAtom } from 'jotai'

import { QueryAtom } from './states/query'

export function useQueryClient() {
  const [queryClient] = useAtom(QueryAtom)
  return queryClient
}
