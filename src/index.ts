export { useAppwrite } from './useAppwrite'
export { useMutation } from './useMutation'
export { useQuery } from './useQuery'
export { useQueryClient } from './useQueryClient'

export * from './account'
export * from './databases'

export { useFunction } from './functions/useFunction'

import { Account_UserFragment, Identity_ProviderFragment } from './account/fragments'

export { getFragmentData } from './__generated__'

export const fragments = {
  Account_UserFragment,
  Identity_ProviderFragment,
}
