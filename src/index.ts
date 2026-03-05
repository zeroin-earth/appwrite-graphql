import type { ResultOf } from 'gql.tada'
import { readFragment } from 'gql.tada'

import * as frags from './account/fragments'

export { useAppwrite } from './useAppwrite'
export { useMutation } from './useMutation'
export { useQuery } from './useQuery'
export { useLazyQuery } from './useLazyQuery'
export { useSuspenseQuery } from './useSuspenseQuery'
export { useQueryClient } from './useQueryClient'

export { createAppwriteClient } from './client'
export { AppwriteProvider } from './AppwriteProvider'

export * from './account'
export * from './avatars'
export * from './databases'
export * from './locale'
export * from './messaging'
export * from './storage'
export * from './teams'

export * from './query/QueryBuilder'
export { Keys } from './query/Keys'

export * from './offline'

export * from './functions/useFunction'
export * from './functions/useGetExecution'
export * from './functions/useListExecutions'

export { readFragment, readFragment as getFragmentData }

export type Account_UserFragmentType = ResultOf<typeof frags.Account_User>
export type Identity_ProviderFragmentType = ResultOf<typeof frags.Identity_Provider>

export const fragments = {
  Account_UserFragment: frags.Account_User,
  Identity_ProviderFragment: frags.Identity_Provider,
}
