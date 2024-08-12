import { useEffect } from 'react'

import { gql } from '../__generated__'
import { AppwriteException } from '../types'
import { useAppwrite } from '../useAppwrite'
import { useQuery } from '../useQuery'
import { useQueryClient } from '../useQueryClient'
import { useSuspenseQuery } from '../useSuspenseQuery'
import type { Collection, Document } from './types'

type DocumentOperation = 'create' | 'update' | 'delete'

const listDocuments = gql(/* GraphQL */ `
  query ListDocuments($databaseId: String!, $collectionId: String!, $queries: [String!]) {
    databasesListDocuments(
      databaseId: $databaseId
      collectionId: $collectionId
      queries: $queries
    ) {
      total
      documents {
        _id
        data
      }
    }
  }
`)

export function useCollection<TDocument>({
  databaseId,
  collectionId,
  queries,
  subscribe = true,
}: {
  databaseId: string
  collectionId: string
  queries: string[]
  subscribe?: boolean
}) {
  const { graphql } = useAppwrite()
  const queryClient = useQueryClient()

  const collection = useQuery<Collection<TDocument>, AppwriteException[], Collection<TDocument>>({
    queryKey: ['appwrite', 'databases', databaseId, collectionId, { queries }],
    queryFn: async () => {
      const { data, errors } = await graphql.query({
        query: listDocuments,
        variables: {
          databaseId,
          collectionId,
          queries,
        },
      })

      if (errors) {
        throw errors
      }

      const documents =
        data.databasesListDocuments?.documents?.map((document) => ({
          ...document,
          ...(document ? (JSON.parse(document.data) as TDocument) : {}),
        })) ?? []

      return {
        total: data.databasesListDocuments?.total ?? 0,
        documents,
      } as Collection<TDocument>
    },
  })

  useEffect(() => {
    if (!subscribe) {
      return
    }

    const unsubscribe = graphql.client.subscribe(
      `databases.${databaseId}.collections.${collectionId}.documents`,
      (response) => {
        const [, operation] = response.events[0].match(/\.(\w+)$/) as RegExpMatchArray
        const document = response.payload as Document<TDocument>

        switch (operation as DocumentOperation) {
          case 'create':
          case 'update':
          case 'delete':
            queryClient.setQueryData(
              ['appwrite', 'databases', databaseId, collectionId, 'documents', document.$id],
              document,
            )

            queryClient.invalidateQueries({
              queryKey: ['appwrite', 'databases', databaseId, collectionId, { queries }],
              exact: true,
            })

            break
        }
      },
    )

    return unsubscribe
  }, [databaseId, collectionId, graphql.client, queryClient, queries, subscribe])

  return {
    ...collection,
    documents: collection.data?.documents,
    total: collection.data?.total,
  }
}

export function useSuspenseCollection<TDocument>({
  databaseId,
  collectionId,
  queries,
  subscribe = true,
}: {
  databaseId: string
  collectionId: string
  queries: string[]
  subscribe?: boolean
}) {
  const { graphql } = useAppwrite()
  const queryClient = useQueryClient()

  const collection = useSuspenseQuery<
    Collection<TDocument>,
    AppwriteException[],
    Collection<TDocument>
  >({
    queryKey: ['appwrite', 'databases', databaseId, collectionId, { queries }],
    queryFn: async () => {
      const { data, errors } = await graphql.query({
        query: listDocuments,
        variables: {
          databaseId,
          collectionId,
          queries,
        },
      })

      if (errors) {
        throw errors
      }

      const documents =
        data.databasesListDocuments?.documents?.map((document) => ({
          ...document,
          ...(document ? (JSON.parse(document.data) as TDocument) : {}),
        })) ?? []

      return {
        total: data.databasesListDocuments?.total ?? 0,
        documents,
      } as Collection<TDocument>
    },
  })

  useEffect(() => {
    if (!subscribe) {
      return
    }

    const unsubscribe = graphql.client.subscribe(
      `databases.${databaseId}.collections.${collectionId}.documents`,
      (response) => {
        const [, operation] = response.events[0].match(/\.(\w+)$/) as RegExpMatchArray
        const document = response.payload as Document<TDocument>

        switch (operation as DocumentOperation) {
          case 'create':
          case 'update':
          case 'delete':
            queryClient.setQueryData(
              ['appwrite', 'databases', databaseId, collectionId, 'documents', document.$id],
              document,
            )

            queryClient.invalidateQueries({
              queryKey: ['appwrite', 'databases', databaseId, collectionId, { queries }],
              exact: true,
            })

            break
        }
      },
    )

    return unsubscribe
  }, [databaseId, collectionId, graphql.client, queryClient, queries])

  return {
    ...collection,
    documents: collection.data?.documents,
    total: collection.data?.total,
  }
}
