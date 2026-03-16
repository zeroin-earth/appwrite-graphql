import type { ResultOf, VariablesOf } from 'gql.tada'
import { graphql as gql } from 'gql.tada'

import { Keys } from '../query/Keys'
import type { AppwriteException } from '../types'
import { useAppwrite } from '../useAppwrite'
import { useMutation } from '../useMutation'
import { useQueryClient } from '../useQueryClient'

export const createDocument = gql(/* GraphQL */ `
  mutation CreateDocument(
    $databaseId: String!
    $collectionId: String!
    $documentId: String!
    $data: Json!
    $permissions: [String!]
    $transactionId: String
  ) {
    databasesCreateDocument(
      databaseId: $databaseId
      collectionId: $collectionId
      documentId: $documentId
      data: $data
      permissions: $permissions
      transactionId: $transactionId
    ) {
      _id
    }
  }
`)

type Variables = VariablesOf<typeof createDocument>
type Result = ResultOf<typeof createDocument>['databasesCreateDocument']

export function useCreateDocument() {
  const { graphql } = useAppwrite()
  const queryClient = useQueryClient()

  const mutationResult = useMutation<
    Result,
    AppwriteException[],
    Omit<Variables, 'permissions'> & {
      permissions?: string[] | null
    }
  >({
    mutationKey: Keys.databases().collections().documents().create(),
    mutationFn: async ({
      databaseId,
      collectionId,
      documentId,
      data,
      permissions,
      transactionId,
    }) => {
      const { data: mutationData, errors } = await graphql.mutation({
        query: createDocument,
        variables: {
          databaseId,
          collectionId,
          documentId,
          data: JSON.stringify(data),
          permissions,
          transactionId,
        },
      })

      if (errors) {
        throw errors
      }
      return mutationData.databasesCreateDocument
    },
    onSuccess: (result, variables) => {
      const documentKeyPrefix = Keys.database(variables.databaseId)
        .collection(variables.collectionId)
        .document(result._id)
        .key()

      void queryClient.invalidateQueries({
        queryKey: Keys.database(variables.databaseId).collection(variables.collectionId).key(),
      })

      queryClient.setQueryData<Variables>(documentKeyPrefix, {
        ...variables,
        ...(variables.data as Record<string, unknown>),
      })
    },
  })

  return mutationResult
}
