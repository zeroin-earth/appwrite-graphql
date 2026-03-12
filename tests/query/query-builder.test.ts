import { Query } from 'appwrite'
import { describe, expect, test } from 'bun:test'

import { q, QueryBuilder } from '../../src/query/QueryBuilder'

type User = {
  name: string
  age: number
  active: boolean
  tags: string[]
  scores: number[]
  location: [number, number]
}

type Post = {
  title: string
  body: string
  views: number
  published: boolean
}

describe('QueryBuilder', () => {
  describe('q() factory', () => {
    test('returns a QueryBuilder instance', () => {
      const builder = q<User>()
      expect(builder).toBeInstanceOf(QueryBuilder)
    })

    test('build() returns empty array for empty builder', () => {
      expect(q<User>().build()).toEqual([])
    })

    test('each builder instance is independent', () => {
      const a = q<User>().equal('name', 'Alice')
      const b = q<User>().equal('name', 'Bob')
      expect(a.build()).not.toEqual(b.build())
    })

    test('build() returns a copy (mutations do not affect output)', () => {
      const builder = q<User>().equal('name', 'Alice')
      const first = builder.build()
      const second = builder.build()
      expect(first).toEqual(second)
      first.push('extra')
      expect(builder.build()).not.toContain('extra')
    })
  })

  describe('comparison methods', () => {
    test('equal with single value', () => {
      const result = q<User>().equal('name', 'Alice').build()
      expect(result).toEqual([Query.equal('name', 'Alice')])
    })

    test('equal with array of values', () => {
      const result = q<User>().equal('name', ['Alice', 'Bob']).build()
      expect(result).toEqual([Query.equal('name', ['Alice', 'Bob'])])
    })

    test('notEqual', () => {
      const result = q<User>().notEqual('name', 'Bob').build()
      expect(result).toEqual([Query.notEqual('name', 'Bob')])
    })

    test('lessThan', () => {
      const result = q<User>().lessThan('age', 30).build()
      expect(result).toEqual([Query.lessThan('age', 30)])
    })

    test('lessThanEqual', () => {
      const result = q<User>().lessThanEqual('age', 30).build()
      expect(result).toEqual([Query.lessThanEqual('age', 30)])
    })

    test('greaterThan', () => {
      const result = q<User>().greaterThan('age', 18).build()
      expect(result).toEqual([Query.greaterThan('age', 18)])
    })

    test('greaterThanEqual', () => {
      const result = q<User>().greaterThanEqual('age', 18).build()
      expect(result).toEqual([Query.greaterThanEqual('age', 18)])
    })

    test('between', () => {
      const result = q<User>().between('age', 18, 65).build()
      expect(result).toEqual([Query.between('age', 18, 65)])
    })

    test('notBetween', () => {
      const result = q<User>().notBetween('age', 0, 17).build()
      expect(result).toEqual([Query.notBetween('age', 0, 17)])
    })

    test('regex', () => {
      const result = q<User>().regex('name', '^A.*').build()
      expect(result).toEqual([Query.regex('name', '^A.*')])
    })
  })

  describe('null and existence checks', () => {
    test('isNull', () => {
      const result = q<User>().isNull('name').build()
      expect(result).toEqual([Query.isNull('name')])
    })

    test('isNotNull', () => {
      const result = q<User>().isNotNull('name').build()
      expect(result).toEqual([Query.isNotNull('name')])
    })

    test('exists', () => {
      const result = q<User>().exists(['name', 'age']).build()
      expect(result).toEqual([Query.exists(['name', 'age'])])
    })

    test('notExists', () => {
      const result = q<User>().notExists(['tags']).build()
      expect(result).toEqual([Query.notExists(['tags'])])
    })
  })

  describe('string methods', () => {
    test('search', () => {
      const result = q<User>().search('name', 'Ali').build()
      expect(result).toEqual([Query.search('name', 'Ali')])
    })

    test('notSearch', () => {
      const result = q<User>().notSearch('name', 'spam').build()
      expect(result).toEqual([Query.notSearch('name', 'spam')])
    })

    test('startsWith', () => {
      const result = q<User>().startsWith('name', 'A').build()
      expect(result).toEqual([Query.startsWith('name', 'A')])
    })

    test('endsWith', () => {
      const result = q<User>().endsWith('name', 'ce').build()
      expect(result).toEqual([Query.endsWith('name', 'ce')])
    })

    test('notStartsWith', () => {
      const result = q<User>().notStartsWith('name', 'Z').build()
      expect(result).toEqual([Query.notStartsWith('name', 'Z')])
    })

    test('notEndsWith', () => {
      const result = q<User>().notEndsWith('name', 'zz').build()
      expect(result).toEqual([Query.notEndsWith('name', 'zz')])
    })
  })

  describe('contains methods', () => {
    test('contains on string field', () => {
      const result = q<User>().contains('name', 'li').build()
      expect(result).toEqual([Query.contains('name', 'li')])
    })

    test('contains on array field', () => {
      const result = q<User>().contains('tags', 'admin').build()
      expect(result).toEqual([Query.contains('tags', 'admin')])
    })

    test('containsAny', () => {
      const result = q<User>().containsAny('tags', ['admin', 'mod']).build()
      expect(result).toEqual([Query.containsAny('tags', ['admin', 'mod'])])
    })

    test('containsAll', () => {
      const result = q<User>().containsAll('tags', ['admin', 'verified']).build()
      expect(result).toEqual([Query.containsAll('tags', ['admin', 'verified'])])
    })

    test('notContains', () => {
      const result = q<User>().notContains('tags', 'banned').build()
      expect(result).toEqual([Query.notContains('tags', 'banned')])
    })
  })

  describe('select', () => {
    test('select specific fields', () => {
      const result = q<User>().select(['name', 'age']).build()
      expect(result).toEqual([Query.select(['name', 'age'])])
    })

    test('select single field', () => {
      const result = q<User>().select(['name']).build()
      expect(result).toEqual([Query.select(['name'])])
    })
  })

  describe('ordering', () => {
    test('orderAsc', () => {
      const result = q<User>().orderAsc('name').build()
      expect(result).toEqual([Query.orderAsc('name')])
    })

    test('orderDesc', () => {
      const result = q<User>().orderDesc('age').build()
      expect(result).toEqual([Query.orderDesc('age')])
    })

    test('orderRandom', () => {
      const result = q<User>().orderRandom().build()
      expect(result).toEqual([Query.orderRandom()])
    })

    test('multiple orderings', () => {
      const result = q<User>().orderAsc('name').orderDesc('age').build()
      expect(result).toEqual([Query.orderAsc('name'), Query.orderDesc('age')])
    })
  })

  describe('pagination', () => {
    test('limit', () => {
      const result = q<User>().limit(25).build()
      expect(result).toEqual([Query.limit(25)])
    })

    test('offset', () => {
      const result = q<User>().offset(50).build()
      expect(result).toEqual([Query.offset(50)])
    })

    test('cursorAfter', () => {
      const result = q<User>().cursorAfter('doc123').build()
      expect(result).toEqual([Query.cursorAfter('doc123')])
    })

    test('cursorBefore', () => {
      const result = q<User>().cursorBefore('doc456').build()
      expect(result).toEqual([Query.cursorBefore('doc456')])
    })

    test('limit and offset together', () => {
      const result = q<User>().limit(10).offset(20).build()
      expect(result).toEqual([Query.limit(10), Query.offset(20)])
    })
  })

  describe('timestamp methods', () => {
    const iso = '2025-01-01T00:00:00.000Z'
    const isoEnd = '2025-12-31T23:59:59.999Z'

    test('createdBefore', () => {
      const result = q<User>().createdBefore(iso).build()
      expect(result).toEqual([Query.createdBefore(iso)])
    })

    test('createdAfter', () => {
      const result = q<User>().createdAfter(iso).build()
      expect(result).toEqual([Query.createdAfter(iso)])
    })

    test('createdBetween', () => {
      const result = q<User>().createdBetween(iso, isoEnd).build()
      expect(result).toEqual([Query.createdBetween(iso, isoEnd)])
    })

    test('updatedBefore', () => {
      const result = q<User>().updatedBefore(iso).build()
      expect(result).toEqual([Query.updatedBefore(iso)])
    })

    test('updatedAfter', () => {
      const result = q<User>().updatedAfter(iso).build()
      expect(result).toEqual([Query.updatedAfter(iso)])
    })

    test('updatedBetween', () => {
      const result = q<User>().updatedBetween(iso, isoEnd).build()
      expect(result).toEqual([Query.updatedBetween(iso, isoEnd)])
    })
  })

  // ─── Logical Composition ────────────────────────────────────────

  describe('logical composition', () => {
    test('or with two sub-builders', () => {
      const result = q<User>()
        .or(q<User>().equal('name', 'Alice'), q<User>().equal('name', 'Bob'))
        .build()

      expect(result).toEqual([Query.or([Query.equal('name', 'Alice'), Query.equal('name', 'Bob')])])
    })

    test('and with two sub-builders', () => {
      const result = q<User>()
        .and(q<User>().equal('name', 'Alice'), q<User>().greaterThan('age', 18))
        .build()

      expect(result).toEqual([
        Query.and([Query.equal('name', 'Alice'), Query.greaterThan('age', 18)]),
      ])
    })

    test('or with multiple conditions per sub-builder', () => {
      const result = q<User>()
        .or(
          q<User>().equal('name', 'Alice').greaterThan('age', 30),
          q<User>().equal('name', 'Bob').lessThan('age', 20),
        )
        .build()

      expect(result).toEqual([
        Query.or([
          Query.equal('name', 'Alice'),
          Query.greaterThan('age', 30),
          Query.equal('name', 'Bob'),
          Query.lessThan('age', 20),
        ]),
      ])
    })

    test('nested or inside and', () => {
      const result = q<User>()
        .and(
          q<User>().greaterThan('age', 18),
          q<User>().or(q<User>().equal('name', 'Alice'), q<User>().equal('name', 'Bob')),
        )
        .build()

      expect(result).toEqual([
        Query.and([
          Query.greaterThan('age', 18),
          Query.or([Query.equal('name', 'Alice'), Query.equal('name', 'Bob')]),
        ]),
      ])
    })
  })

  describe('elemMatch', () => {
    test('elemMatch with sub-query', () => {
      const result = q<User>()
        .elemMatch('scores', q<User>().greaterThan('age', 90))
        .build()

      expect(result).toEqual([Query.elemMatch('scores', [Query.greaterThan('age', 90)])])
    })
  })

  describe('geo and distance methods', () => {
    const points: [number, number][] = [
      [0, 0],
      [1, 0],
      [1, 1],
      [0, 1],
    ]

    test('distanceEqual', () => {
      const result = q<User>().distanceEqual('location', 40.7, -74.0, 1000).build()
      expect(result).toEqual([Query.distanceEqual('location', [40.7, -74.0], 1000, true)])
    })

    test('distanceEqual with meters=false', () => {
      const result = q<User>().distanceEqual('location', 40.7, -74.0, 1000, false).build()
      expect(result).toEqual([Query.distanceEqual('location', [40.7, -74.0], 1000, false)])
    })

    test('distanceNotEqual', () => {
      const result = q<User>().distanceNotEqual('location', 40.7, -74.0, 500).build()
      expect(result).toEqual([Query.distanceNotEqual('location', [40.7, -74.0], 500, true)])
    })

    test('distanceGreaterThan', () => {
      const result = q<User>().distanceGreaterThan('location', 40.7, -74.0, 100).build()
      expect(result).toEqual([Query.distanceGreaterThan('location', [40.7, -74.0], 100, true)])
    })

    test('distanceLessThan', () => {
      const result = q<User>().distanceLessThan('location', 40.7, -74.0, 5000).build()
      expect(result).toEqual([Query.distanceLessThan('location', [40.7, -74.0], 5000, true)])
    })

    test('intersects', () => {
      const result = q<User>().intersects('location', points).build()
      expect(result).toEqual([Query.intersects('location', points)])
    })

    test('notIntersects', () => {
      const result = q<User>().notIntersects('location', points).build()
      expect(result).toEqual([Query.notIntersects('location', points)])
    })

    test('crosses', () => {
      const result = q<User>().crosses('location', points).build()
      expect(result).toEqual([Query.crosses('location', points)])
    })

    test('notCrosses', () => {
      const result = q<User>().notCrosses('location', points).build()
      expect(result).toEqual([Query.notCrosses('location', points)])
    })

    test('overlaps', () => {
      const result = q<User>().overlaps('location', points).build()
      expect(result).toEqual([Query.overlaps('location', points)])
    })

    test('notOverlaps', () => {
      const result = q<User>().notOverlaps('location', points).build()
      expect(result).toEqual([Query.notOverlaps('location', points)])
    })

    test('touches', () => {
      const result = q<User>().touches('location', points).build()
      expect(result).toEqual([Query.touches('location', points)])
    })

    test('notTouches', () => {
      const result = q<User>().notTouches('location', points).build()
      expect(result).toEqual([Query.notTouches('location', points)])
    })
  })

  describe('chaining', () => {
    test('multiple different methods produce correct array', () => {
      const result = q<User>()
        .equal('name', 'Alice')
        .greaterThan('age', 18)
        .isNotNull('tags')
        .orderAsc('name')
        .limit(10)
        .offset(0)
        .build()

      expect(result).toEqual([
        Query.equal('name', 'Alice'),
        Query.greaterThan('age', 18),
        Query.isNotNull('tags'),
        Query.orderAsc('name'),
        Query.limit(10),
        Query.offset(0),
      ])
    })

    test('preserves insertion order', () => {
      const result = q<User>().limit(5).equal('name', 'Alice').orderDesc('age').build()

      expect(result).toEqual([Query.limit(5), Query.equal('name', 'Alice'), Query.orderDesc('age')])
    })

    test('complex real-world query', () => {
      const result = q<User>()
        .greaterThanEqual('age', 21)
        .equal('active', true)
        .contains('tags', 'verified')
        .select(['name', 'age', 'tags'])
        .orderDesc('age')
        .limit(50)
        .build()

      expect(result).toEqual([
        Query.greaterThanEqual('age', 21),
        Query.equal('active', true),
        Query.contains('tags', 'verified'),
        Query.select(['name', 'age', 'tags']),
        Query.orderDesc('age'),
        Query.limit(50),
      ])
    })
  })

  describe('interoperability', () => {
    test('build() output can be spread with raw Query strings', () => {
      const builderQueries = q<User>().equal('name', 'Alice').greaterThan('age', 18).build()
      const combined = [...builderQueries, Query.limit(10)]

      expect(combined).toEqual([
        Query.equal('name', 'Alice'),
        Query.greaterThan('age', 18),
        Query.limit(10),
      ])
    })

    test('output strings match Query class output exactly', () => {
      const builderOutput = q<User>().equal('name', 'Alice').build()[0]
      const directOutput = Query.equal('name', 'Alice')
      expect(builderOutput).toBe(directOutput)
    })
  })

  describe('type safety', () => {
    test('rejects invalid field names', () => {
      // @ts-expect-error — 'nme' is not a key of User
      q<User>().equal('nme', 'Alice')
    })

    test('rejects wrong value type for numeric field', () => {
      // @ts-expect-error — age expects number, not string
      q<User>().greaterThan('age', '18')
    })

    test('rejects wrong value type for boolean field', () => {
      // @ts-expect-error — active expects boolean, not string
      q<User>().equal('active', 'yes')
    })

    test('rejects invalid field in select', () => {
      // @ts-expect-error — 'invalid' is not a key of User
      q<User>().select(['name', 'invalid'])
    })

    test('rejects invalid field in orderAsc', () => {
      // @ts-expect-error — 'invalid' is not a key of User
      q<User>().orderAsc('invalid')
    })

    test('rejects invalid field in isNull', () => {
      // @ts-expect-error — 'invalid' is not a key of User
      q<User>().isNull('invalid')
    })

    test('works with different document types', () => {
      const result = q<Post>()
        .equal('title', 'Hello World')
        .greaterThan('views', 100)
        .equal('published', true)
        .build()

      expect(result).toEqual([
        Query.equal('title', 'Hello World'),
        Query.greaterThan('views', 100),
        Query.equal('published', true),
      ])
    })
  })
})
