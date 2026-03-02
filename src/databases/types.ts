import { Query } from 'appwrite'

import type { Models } from '../types'

export type Document<T> = T & Models.Document
export type Collection<T> = Models.DocumentList<Document<T>>

/** Prepends Query.select() to a queries array when fields are specified. */
export function mergeFieldsQuery(queries: string[], fields?: string[]): string[] {
  if (!fields || fields.length === 0) return queries
  return [Query.select(fields), ...queries]
}
