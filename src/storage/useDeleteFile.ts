import type { ResultOf, VariablesOf } from 'gql.tada'
import { graphql as gql } from 'gql.tada'

import { Keys } from '../query/Keys'
import type { AppwriteException } from '../types'
import { useAppwrite } from '../useAppwrite'
import { useMutation } from '../useMutation'
import { useQueryClient } from '../useQueryClient'

const deleteFile = gql(/* GraphQL */ `
  mutation DeleteFile($bucketId: String!, $fileId: String!) {
    storageDeleteFile(bucketId: $bucketId, fileId: $fileId) {
      status
    }
  }
`)

type Variables = VariablesOf<typeof deleteFile>
type Result = ResultOf<typeof deleteFile>['storageDeleteFile']

export function useDeleteFile() {
  const { graphql } = useAppwrite()
  const queryClient = useQueryClient()

  const mutationResult = useMutation<Result, AppwriteException[], Variables>({
    mutationKey: Keys.buckets().files().delete(),
    mutationFn: async ({ bucketId, fileId }) => {
      const { data, errors } = await graphql.mutation({
        query: deleteFile,
        variables: { bucketId, fileId },
      })

      if (errors) {
        throw errors
      }

      return data?.storageDeleteFile ?? { status: '' }
    },
    onSuccess: (_, variables) => {
      queryClient.removeQueries({
        queryKey: Keys.bucket(variables.bucketId).file(variables.fileId).key(),
      })
      void queryClient.invalidateQueries({
        queryKey: Keys.bucket(variables.bucketId).files().key(),
      })
    },
  })

  return { ...mutationResult }
}
