import type { Models } from '../types'

/**
 * A TablesDB row merged with its typed data shape `T`.
 * Equivalent to `Document<T>` from the databases namespace, but for TablesDB rows.
 */
export type Row<T> = T & Models.Document

/**
 * A list of TablesDB rows of shape `T`, with a `total` count.
 * Equivalent to `Collection<T>` from the databases namespace, but for rows.
 */
export type RowCollection<T> = Models.DocumentList<Row<T>>
