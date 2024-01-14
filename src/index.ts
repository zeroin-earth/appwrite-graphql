export { useAppwrite } from './useAppwrite'
export { useMutation } from './useMutation'
export { useQuery } from './useQuery'
export { useQueryClient } from './useQueryClient'

export { useAccount } from './account/useAccount'
export { useLogin } from './account/useLogin'
export { useLogout } from './account/useLogout'
export { usePasswordRecovery } from './account/usePasswordRecovery'
export { useResetPassword } from './account/useResetPassword'
export { useSignUp } from './account/useSignUp'
export { useVerification } from './account/useVerification'

export { useCollection } from './databases/useCollection'
export { useCreateDocument } from './databases/useCreateDocument'
export { useDocument } from './databases/useDocument'

export { useFunction } from './functions/useFunction'

import { Account_UserFragment } from './account/fragments'

export { getFragmentData } from './__generated__'

export const fragments = {
  Account_UserFragment,
}
