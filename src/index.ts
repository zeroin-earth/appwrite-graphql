import * as frags from './account/fragments'

export { useAppwrite } from './useAppwrite'
export { useMutation } from './useMutation'
export { useQuery } from './useQuery'
export { useQueryClient } from './useQueryClient'

export * from './account'
export * from './databases'

export * from './functions/useFunction'

export { getFragmentData } from './__generated__'

export namespace fragments {
  export const Account_UserFragment = frags.Account_UserFragment
  export const Identity_ProviderFragment = frags.Identity_ProviderFragment
}
