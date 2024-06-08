export { useAppwrite } from './useAppwrite'
export { useMutation } from './useMutation'
export { useQuery } from './useQuery'
export { useQueryClient } from './useQueryClient'

export * from './account'
export * from './databases'

export * from './functions/useFunction'

import * as frags from './account/fragments'

export { getFragmentData } from './__generated__'

export const fragments = {
  ...frags,
}
