import * as frags from './account/fragments'
import { Account_UserFragment, Identity_ProviderFragment } from './__generated__/graphql'

export { useAppwrite } from './useAppwrite'
export { useMutation } from './useMutation'
export { useQuery } from './useQuery'
export { useQueryClient } from './useQueryClient'

export * from './account'
export * from './databases'

export * from './functions/useFunction'

export { getFragmentData } from './__generated__'

export namespace fragments {
  export const Account_UserFragment = frags.Account_User
  export type Account_UserFragmentType = Account_UserFragment

  export const Identity_ProviderFragment = frags.Identity_Provider
  export type Identity_ProviderFragmentType = Identity_ProviderFragment
}
