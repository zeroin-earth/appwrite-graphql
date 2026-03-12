import { Query } from 'appwrite'

export function mergeFieldsQuery(queries: string[], fields?: string[]): string[] {
  if (!fields || fields.length === 0) return queries
  return [Query.select(fields), ...queries]
}
