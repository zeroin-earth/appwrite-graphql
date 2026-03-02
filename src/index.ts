import type { Account_UserFragment, Identity_ProviderFragment } from './__generated__/graphql'
import * as frags from './account/fragments'

export { useAppwrite } from './useAppwrite'
export { useMutation } from './useMutation'
export { useQuery } from './useQuery'
export { useLazyQuery } from './useLazyQuery'
export { useSuspenseQuery } from './useSuspenseQuery'
export { useQueryClient } from './useQueryClient'
export { AppwriteProvider } from './AppwriteProvider'

export * from './account'
export * from './avatars'
export * from './databases'
export * from './locale'
export * from './messaging'
export * from './storage'
export * from './teams'

export * from './query/QueryBuilder'

export * from './functions/useFunction'
export * from './functions/useGetExecution'
export * from './functions/useListExecutions'

export { getFragmentData } from './__generated__'

export type Account_UserFragmentType = Account_UserFragment
export type Identity_ProviderFragmentType = Identity_ProviderFragment

export const fragments = {
  Account_UserFragment: frags.Account_User,
  Identity_ProviderFragment: frags.Identity_Provider,
}
