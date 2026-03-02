import type { QueryTypes } from 'appwrite'
import { Query } from 'appwrite'

type FieldValue<T, K extends keyof T> = T[K]

type ArrayElement<T> = T extends (infer E)[] ? E : never

type ContainsValue<T, K extends keyof T> = T[K] extends unknown[]
  ? ArrayElement<T[K]> | ArrayElement<T[K]>[]
  : T[K] extends string
    ? string
    : T[K] | T[K][]

export class QueryBuilder<T extends Record<string, unknown>> {
  private queries: string[] = []

  equal<K extends keyof T & string>(field: K, value: FieldValue<T, K> | FieldValue<T, K>[]): this {
    this.queries.push(Query.equal(field, value as QueryTypes))
    return this
  }

  notEqual<K extends keyof T & string>(
    field: K,
    value: FieldValue<T, K> | FieldValue<T, K>[],
  ): this {
    this.queries.push(Query.notEqual(field, value as QueryTypes))
    return this
  }

  regex<K extends keyof T & string>(field: K, pattern: string): this {
    this.queries.push(Query.regex(field, pattern))
    return this
  }

  lessThan<K extends keyof T & string>(field: K, value: FieldValue<T, K>): this {
    this.queries.push(Query.lessThan(field, value as QueryTypes))
    return this
  }

  lessThanEqual<K extends keyof T & string>(field: K, value: FieldValue<T, K>): this {
    this.queries.push(Query.lessThanEqual(field, value as QueryTypes))
    return this
  }

  greaterThan<K extends keyof T & string>(field: K, value: FieldValue<T, K>): this {
    this.queries.push(Query.greaterThan(field, value as QueryTypes))
    return this
  }

  greaterThanEqual<K extends keyof T & string>(field: K, value: FieldValue<T, K>): this {
    this.queries.push(Query.greaterThanEqual(field, value as QueryTypes))
    return this
  }

  isNull<K extends keyof T & string>(field: K): this {
    this.queries.push(Query.isNull(field))
    return this
  }

  isNotNull<K extends keyof T & string>(field: K): this {
    this.queries.push(Query.isNotNull(field))
    return this
  }

  exists<K extends keyof T & string>(fields: K[]): this {
    this.queries.push(Query.exists(fields))
    return this
  }

  notExists<K extends keyof T & string>(fields: K[]): this {
    this.queries.push(Query.notExists(fields))
    return this
  }

  between<K extends keyof T & string>(
    field: K,
    start: string | number | bigint,
    end: string | number | bigint,
  ): this {
    this.queries.push(Query.between(field, start, end))
    return this
  }

  startsWith<K extends keyof T & string>(field: K, prefix: string): this {
    this.queries.push(Query.startsWith(field, prefix))
    return this
  }

  endsWith<K extends keyof T & string>(field: K, suffix: string): this {
    this.queries.push(Query.endsWith(field, suffix))
    return this
  }

  select<K extends keyof T & string>(fields: K[]): this {
    this.queries.push(Query.select(fields))
    return this
  }

  search<K extends keyof T & string>(field: K, term: string): this {
    this.queries.push(Query.search(field, term))
    return this
  }

  orderAsc<K extends keyof T & string>(field: K): this {
    this.queries.push(Query.orderAsc(field))
    return this
  }

  orderDesc<K extends keyof T & string>(field: K): this {
    this.queries.push(Query.orderDesc(field))
    return this
  }

  orderRandom(): this {
    this.queries.push(Query.orderRandom())
    return this
  }

  cursorAfter(id: string): this {
    this.queries.push(Query.cursorAfter(id))
    return this
  }

  cursorBefore(id: string): this {
    this.queries.push(Query.cursorBefore(id))
    return this
  }

  limit(count: number): this {
    this.queries.push(Query.limit(count))
    return this
  }

  offset(count: number): this {
    this.queries.push(Query.offset(count))
    return this
  }

  contains<K extends keyof T & string>(field: K, value: ContainsValue<T, K>): this {
    this.queries.push(Query.contains(field, value as string | any[]))
    return this
  }

  containsAny<K extends keyof T & string>(field: K, values: ContainsValue<T, K>[]): this {
    this.queries.push(Query.containsAny(field, values as any[]))
    return this
  }

  containsAll<K extends keyof T & string>(field: K, values: ContainsValue<T, K>[]): this {
    this.queries.push(Query.containsAll(field, values as any[]))
    return this
  }

  notContains<K extends keyof T & string>(field: K, value: ContainsValue<T, K>): this {
    this.queries.push(Query.notContains(field, value as string | any[]))
    return this
  }

  notSearch<K extends keyof T & string>(field: K, term: string): this {
    this.queries.push(Query.notSearch(field, term))
    return this
  }

  notBetween<K extends keyof T & string>(
    field: K,
    start: string | number | bigint,
    end: string | number | bigint,
  ): this {
    this.queries.push(Query.notBetween(field, start, end))
    return this
  }

  notStartsWith<K extends keyof T & string>(field: K, prefix: string): this {
    this.queries.push(Query.notStartsWith(field, prefix))
    return this
  }

  notEndsWith<K extends keyof T & string>(field: K, suffix: string): this {
    this.queries.push(Query.notEndsWith(field, suffix))
    return this
  }

  createdBefore(date: string): this {
    this.queries.push(Query.createdBefore(date))
    return this
  }

  createdAfter(date: string): this {
    this.queries.push(Query.createdAfter(date))
    return this
  }

  createdBetween(start: string, end: string): this {
    this.queries.push(Query.createdBetween(start, end))
    return this
  }

  updatedBefore(date: string): this {
    this.queries.push(Query.updatedBefore(date))
    return this
  }

  updatedAfter(date: string): this {
    this.queries.push(Query.updatedAfter(date))
    return this
  }

  updatedBetween(start: string, end: string): this {
    this.queries.push(Query.updatedBetween(start, end))
    return this
  }

  or(...queries: QueryBuilder<T>[]): this {
    const orQueries = queries.flatMap((q) => q.queries)
    this.queries.push(Query.or(orQueries))
    return this
  }

  and(...queries: QueryBuilder<T>[]): this {
    const andQueries = queries.flatMap((q) => q.queries)
    this.queries.push(Query.and(andQueries))
    return this
  }

  elemMatch<K extends keyof T & string>(field: K, query: QueryBuilder<T>): this {
    this.queries.push(Query.elemMatch(field, query.queries))
    return this
  }

  distanceEqual<K extends keyof T & string>(
    field: K,
    latitude: number,
    longitude: number,
    distance: number,
    meters: boolean = true,
  ): this {
    this.queries.push(Query.distanceEqual(field, [latitude, longitude], distance, meters))
    return this
  }

  distanceNotEqual<K extends keyof T & string>(
    field: K,
    latitude: number,
    longitude: number,
    distance: number,
    meters: boolean = true,
  ): this {
    this.queries.push(Query.distanceNotEqual(field, [latitude, longitude], distance, meters))
    return this
  }

  distanceGreaterThan<K extends keyof T & string>(
    field: K,
    latitude: number,
    longitude: number,
    distance: number,
    meters: boolean = true,
  ): this {
    this.queries.push(Query.distanceGreaterThan(field, [latitude, longitude], distance, meters))
    return this
  }

  distanceLessThan<K extends keyof T & string>(
    field: K,
    latitude: number,
    longitude: number,
    distance: number,
    meters: boolean = true,
  ): this {
    this.queries.push(Query.distanceLessThan(field, [latitude, longitude], distance, meters))
    return this
  }

  intersects<K extends keyof T & string>(field: K, points: [number, number][]): this {
    this.queries.push(Query.intersects(field, points))
    return this
  }

  notIntersects<K extends keyof T & string>(field: K, points: [number, number][]): this {
    this.queries.push(Query.notIntersects(field, points))
    return this
  }

  crosses<K extends keyof T & string>(field: K, points: [number, number][]): this {
    this.queries.push(Query.crosses(field, points))
    return this
  }

  notCrosses<K extends keyof T & string>(field: K, points: [number, number][]): this {
    this.queries.push(Query.notCrosses(field, points))
    return this
  }

  overlaps<K extends keyof T & string>(field: K, points: [number, number][]): this {
    this.queries.push(Query.overlaps(field, points))
    return this
  }

  notOverlaps<K extends keyof T & string>(field: K, points: [number, number][]): this {
    this.queries.push(Query.notOverlaps(field, points))
    return this
  }

  touches<K extends keyof T & string>(field: K, points: [number, number][]): this {
    this.queries.push(Query.touches(field, points))
    return this
  }

  notTouches<K extends keyof T & string>(field: K, points: [number, number][]): this {
    this.queries.push(Query.notTouches(field, points))
    return this
  }

  build() {
    return [...this.queries]
  }
}

export function q<T extends Record<string, unknown>>(): QueryBuilder<T> {
  return new QueryBuilder<T>()
}
