import { graphql as gql } from 'gql.tada'

import type { Row, RowCollection } from './types'
import type { AppwriteClient } from '../client'
import { mergeFieldsQuery } from '../databases/utils'
import { Keys } from '../query/Keys'

type RowParams<TRow = Record<string, unknown>> = {
  databaseId: string
  tableId: string
  rowId: string
  queries?: string[]
  transactionId?: string
  fields?: (keyof TRow & string)[]
}

export const getRow = gql(/* GraphQL */ `
  query GetRow(
    $databaseId: String!
    $tableId: String!
    $rowId: String!
    $queries: [String]
    $transactionId: String
  ) {
    tablesDBGetRow(
      databaseId: $databaseId
      tableId: $tableId
      rowId: $rowId
      queries: $queries
      transactionId: $transactionId
    ) {
      _id
      data
    }
  }
`)

export function getRowQuery<TRow>(
  client: AppwriteClient,
  { databaseId, tableId, rowId, queries, transactionId, fields }: RowParams<TRow>,
) {
  const rawQueries = Array.isArray(queries) ? queries : queries ? [queries] : []
  const mergedQueries = mergeFieldsQuery(rawQueries, fields)

  return {
    queryKey: [
      ...Keys.tablesDB(databaseId).table(tableId).row(rowId).key(),
      ...mergedQueries,
    ] as const,
    queryFn: async () => {
      const { data, errors } = await client.graphql.query({
        query: getRow,
        variables: {
          databaseId,
          tableId,
          rowId,
          queries: mergedQueries.length > 0 ? mergedQueries : undefined,
          transactionId,
        },
      })

      if (errors) {
        throw errors
      }

      const row = {
        ...data.tablesDBGetRow,
        ...(data.tablesDBGetRow ? (JSON.parse(data.tablesDBGetRow.data as string) as TRow) : {}),
      } as unknown as Row<TRow>

      return row
    },
  }
}

export const listRows = gql(/* GraphQL */ `
  query ListRows(
    $databaseId: String!
    $tableId: String!
    $queries: [String]
    $transactionId: String
  ) {
    tablesDBListRows(
      databaseId: $databaseId
      tableId: $tableId
      queries: $queries
      transactionId: $transactionId
    ) {
      total
      rows {
        _id
        data
      }
    }
  }
`)

export function getTableRowsQuery<TRow>(
  client: AppwriteClient,
  { databaseId, tableId, queries, transactionId, fields }: Omit<RowParams<TRow>, 'rowId'>,
) {
  const mergedQueries = mergeFieldsQuery(queries ?? [], fields)

  return {
    queryKey: [...Keys.tablesDB(databaseId).table(tableId).rows().key(), ...mergedQueries] as const,
    queryFn: async () => {
      const { data, errors } = await client.graphql.query({
        query: listRows,
        variables: {
          databaseId,
          tableId,
          queries: mergedQueries,
          transactionId,
        },
      })

      if (errors) {
        throw errors
      }

      const rows =
        data.tablesDBListRows?.rows?.map((row) => ({
          ...row,
          ...(row ? (JSON.parse(row.data as string) as TRow) : {}),
        })) ?? []

      return {
        total: data.tablesDBListRows?.total ?? 0,
        documents: rows,
      } as unknown as RowCollection<TRow>
    },
  }
}
