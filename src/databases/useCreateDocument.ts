import type { ResultOf, VariablesOf } from 'gql.tada'
import { graphql as gql } from 'gql.tada'

import { Keys } from '../query/Keys'
import type { AppwriteException, Prettify } from '../types'
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

/** The result returned after creating a document. */
export type CreateDocumentResult = Prettify<
  ResultOf<typeof createDocument>['databasesCreateDocument']
>

/** The variables accepted by the {@link useCreateDocument} mutation. */
export type CreateDocumentVariables = Prettify<
  Omit<Variables, 'permissions'> & {
    permissions?: string[] | null
  }
>

/**
 * Mutation hook to create a new document.
 *
 * Invalidates collection queries and sets the new document in the cache on success.
 *
 * @example
 * ```tsx
 * const { mutate, isPending } = useCreateDocument()
 *
 * mutate({
 *   databaseId: 'my-db',
 *   collectionId: 'my-collection',
 *   documentId: ID.unique(),
 *   data: { name: 'John', age: 30 },
 *   permissions: ['read("any")'],
 * })
 * ```
 *
 * **Variables** ({@link CreateDocumentVariables}):
 * - `databaseId` — The target database ID
 * - `collectionId` — The target collection ID
 * - `documentId` — Unique document ID (use `ID.unique()` for auto-generation)
 * - `data` — The document data as a JSON-serializable object
 * - `permissions` — Optional array of permission strings, or `null`
 * - `transactionId` — Optional transaction ID for atomic operations
 *
 * @returns A `UseMutationResult` with the created document's `_id`.
 */
export function useCreateDocument() {
  const { graphql } = useAppwrite()
  const queryClient = useQueryClient()

  const mutationResult = useMutation<
    CreateDocumentResult,
    AppwriteException[],
    CreateDocumentVariables
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
