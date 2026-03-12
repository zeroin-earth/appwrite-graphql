import type { ResultOf, VariablesOf } from 'gql.tada'
import { graphql as gql } from 'gql.tada'

import { Keys } from '../query/Keys'
import type { AppwriteException } from '../types'
import { useAppwrite } from '../useAppwrite'
import { useMutation } from '../useMutation'
import { useQueryClient } from '../useQueryClient'

export const updateFile = gql(/* GraphQL */ `
  mutation UpdateFile(
    $bucketId: String!
    $fileId: String!
    $name: String
    $permissions: [String!]
  ) {
    storageUpdateFile(
      bucketId: $bucketId
      fileId: $fileId
      name: $name
      permissions: $permissions
    ) {
      _id
      bucketId
      name
      _permissions
    }
  }
`)

type Variables = VariablesOf<typeof updateFile>
type Result = ResultOf<typeof updateFile>['storageUpdateFile']

export function useUpdateFile() {
  const { graphql } = useAppwrite()
  const queryClient = useQueryClient()

  const mutationResult = useMutation<Result, AppwriteException[], Variables>({
    mutationKey: Keys.buckets().files().update(),
    mutationFn: async ({ bucketId, fileId, name, permissions }) => {
      const { data, errors } = await graphql.mutation({
        query: updateFile,
        variables: { bucketId, fileId, name, permissions },
      })

      if (errors) {
        throw errors
      }

      return data.storageUpdateFile
    },
    onSuccess: (_, variables) => {
      void queryClient.invalidateQueries({
        queryKey: Keys.bucket(variables.bucketId).files().key(),
      })
    },
  })

  return { ...mutationResult }
}
