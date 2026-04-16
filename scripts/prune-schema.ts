/**
 * prune-schema.ts
 *
 * One-off (re-runnable) script that prunes src/schema.graphql down to only the
 * types and fields reachable from the root Query/Mutation fields that our React
 * hooks actually reference.
 *
 * Usage:
 *   bun run scripts/prune-schema.ts
 */

import * as fs from 'fs'
import * as path from 'path'
import {
  buildSchema,
  isListType,
  isNonNullType,
  parse,
  type DocumentNode,
  type FieldNode,
  type GraphQLEnumType,
  type GraphQLField,
  type GraphQLInputObjectType,
  type GraphQLInterfaceType,
  type GraphQLNamedType,
  type GraphQLObjectType,
  type GraphQLOutputType,
  type GraphQLScalarType,
  type GraphQLSchema,
  type GraphQLType,
  type GraphQLUnionType,
  type OperationDefinitionNode,
} from 'graphql'

// ---------------------------------------------------------------------------
// 1. Locate all *.ts source files under src/ (excluding .d.ts files)
// ---------------------------------------------------------------------------

const SCRIPT_DIR = path.dirname(new URL(import.meta.url).pathname)
const SRC_DIR = path.resolve(SCRIPT_DIR, '../src')
const SCHEMA_PATH = path.resolve(SRC_DIR, 'schema.graphql')

function findTsFiles(dir: string): string[] {
  const results: string[] = []
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      results.push(...findTsFiles(full))
    } else if (entry.isFile() && entry.name.endsWith('.ts') && !entry.name.endsWith('.d.ts')) {
      results.push(full)
    }
  }
  return results
}

// ---------------------------------------------------------------------------
// 2. Extract all gql`...` template literals from source files
// ---------------------------------------------------------------------------

/**
 * Finds all backtick-delimited strings that follow `gql(/* GraphQL * /` and
 * returns each template content.
 */
function extractGqlStrings(source: string): string[] {
  const results: string[] = []
  const re = /gql\s*\(\s*(?:\/\*[^*]*\*+(?:[^/*][^*]*\*+)*\/\s*)?\`([\s\S]*?)\`/g
  let m: RegExpExecArray | null
  while ((m = re.exec(source)) !== null) {
    results.push(m[1])
  }
  return results
}

// ---------------------------------------------------------------------------
// 3. Collect used root field names from parsed GraphQL documents
// ---------------------------------------------------------------------------

function collectUsedRootFields(docs: DocumentNode[]): Set<string> {
  const used = new Set<string>()
  for (const doc of docs) {
    for (const def of doc.definitions) {
      if (def.kind !== 'OperationDefinition') continue
      const op = def as OperationDefinitionNode
      for (const sel of op.selectionSet.selections) {
        if (sel.kind === 'Field') {
          used.add((sel as FieldNode).name.value)
        }
      }
    }
  }
  return used
}

// ---------------------------------------------------------------------------
// 4. BFS over the schema to collect all reachable named types
// ---------------------------------------------------------------------------

/**
 * Unwrap NonNull / List wrappers and return the named type.
 */
function unwrapToNamed(type: GraphQLType): GraphQLNamedType {
  if (isNonNullType(type) || isListType(type)) {
    return unwrapToNamed(type.ofType)
  }
  return type as GraphQLNamedType
}

/**
 * Walk all types reachable from the given set of root field names on the
 * Query and Mutation types.
 */
function collectReachableTypes(schema: GraphQLSchema, usedRootFields: Set<string>): Set<string> {
  const reachable = new Set<string>()
  const queue: GraphQLNamedType[] = []

  function enqueue(t: GraphQLNamedType): void {
    if (!t.name || reachable.has(t.name)) return
    reachable.add(t.name)
    queue.push(t)
  }

  // Built-in scalars are always reachable (no need to emit them)
  for (const name of ['String', 'Int', 'Float', 'Boolean', 'ID']) {
    reachable.add(name)
  }

  // Seed from used root fields on Query and Mutation
  for (const getRootType of [() => schema.getQueryType(), () => schema.getMutationType()]) {
    const rootType = getRootType()
    if (!rootType) continue
    const fields = rootType.getFields()
    for (const fieldName of Object.keys(fields)) {
      if (!usedRootFields.has(fieldName)) continue
      const field = fields[fieldName]
      enqueue(unwrapToNamed(field.type as GraphQLOutputType))
      for (const arg of field.args ?? []) {
        enqueue(unwrapToNamed(arg.type))
      }
    }
  }

  // BFS
  while (queue.length > 0) {
    const current = queue.shift()!
    const typeDef = schema.getType(current.name)
    if (!typeDef) continue

    if (typeDef.astNode?.kind === 'ObjectTypeDefinition') {
      const objType = typeDef as GraphQLObjectType
      for (const field of Object.values(objType.getFields()) as GraphQLField<unknown, unknown>[]) {
        enqueue(unwrapToNamed(field.type as GraphQLOutputType))
        for (const arg of field.args ?? []) {
          enqueue(unwrapToNamed(arg.type))
        }
      }
      for (const iface of objType.getInterfaces?.() ?? []) {
        enqueue(iface)
      }
    } else if (typeDef.astNode?.kind === 'InterfaceTypeDefinition') {
      const ifaceType = typeDef as GraphQLInterfaceType
      for (const field of Object.values(ifaceType.getFields()) as GraphQLField<
        unknown,
        unknown
      >[]) {
        enqueue(unwrapToNamed(field.type as GraphQLOutputType))
      }
    } else if (typeDef.astNode?.kind === 'InputObjectTypeDefinition') {
      const inputType = typeDef as GraphQLInputObjectType
      for (const field of Object.values(inputType.getFields())) {
        enqueue(unwrapToNamed(field.type))
      }
    } else if (typeDef.astNode?.kind === 'UnionTypeDefinition') {
      const unionType = typeDef as GraphQLUnionType
      for (const member of unionType.getTypes()) {
        enqueue(member)
      }
    }
    // Enums and scalars are leaf types — no further traversal needed
  }

  return reachable
}

// ---------------------------------------------------------------------------
// 5. Emit the pruned schema
// ---------------------------------------------------------------------------

function emitPrunedSchema(
  schema: GraphQLSchema,
  reachable: Set<string>,
  usedRootFields: Set<string>,
): string {
  const parts: string[] = []
  const builtInNames = new Set(['String', 'Int', 'Float', 'Boolean', 'ID'])
  const rootNames = new Set(['Query', 'Mutation', 'Subscription'])

  // Emit a root operation type, filtering to only used fields
  function emitRootType(typeName: string, type: GraphQLObjectType): void {
    const fields = type.getFields()
    const fieldLines: string[] = []
    for (const fieldName of Object.keys(fields).sort()) {
      if (!usedRootFields.has(fieldName)) continue
      const field = fields[fieldName]
      if (field.args && field.args.length > 0) {
        const argLines = field.args.map((a) => `    ${a.name}: ${a.type.toString()}`)
        fieldLines.push(`  ${fieldName}(\n${argLines.join('\n')}\n  ): ${field.type.toString()}`)
      } else {
        fieldLines.push(`  ${fieldName}: ${field.type.toString()}`)
      }
    }
    if (fieldLines.length > 0) {
      parts.push(`type ${typeName} {\n${fieldLines.join('\n')}\n}`)
    }
  }

  const queryType = schema.getQueryType()
  const mutationType = schema.getMutationType()
  if (queryType) emitRootType('Query', queryType)
  if (mutationType) emitRootType('Mutation', mutationType)

  // Emit all other reachable types in original schema definition order
  for (const [typeName, typeDef] of Object.entries(schema.getTypeMap())) {
    if (typeName.startsWith('__')) continue
    if (builtInNames.has(typeName) || rootNames.has(typeName)) continue
    if (!reachable.has(typeName)) continue

    const ast = typeDef.astNode
    if (!ast) continue

    if (ast.kind === 'ObjectTypeDefinition') {
      const objType = typeDef as GraphQLObjectType
      const ifaces = objType.getInterfaces?.() ?? []
      const ifaceStr =
        ifaces.length > 0 ? ` implements ${ifaces.map((i) => i.name).join(' & ')}` : ''
      const fieldLines = Object.values(objType.getFields()).map((f) => {
        const argStr =
          f.args && f.args.length > 0
            ? `(${f.args.map((a) => `${a.name}: ${a.type.toString()}`).join(', ')})`
            : ''
        return `  ${f.name}${argStr}: ${f.type.toString()}`
      })
      parts.push(`type ${typeName}${ifaceStr} {\n${fieldLines.join('\n')}\n}`)
    } else if (ast.kind === 'InterfaceTypeDefinition') {
      const ifaceType = typeDef as GraphQLInterfaceType
      const fieldLines = Object.values(ifaceType.getFields()).map(
        (f) => `  ${f.name}: ${f.type.toString()}`,
      )
      parts.push(`interface ${typeName} {\n${fieldLines.join('\n')}\n}`)
    } else if (ast.kind === 'InputObjectTypeDefinition') {
      const inputType = typeDef as GraphQLInputObjectType
      const fieldLines = Object.values(inputType.getFields()).map(
        (f) => `  ${f.name}: ${f.type.toString()}`,
      )
      parts.push(`input ${typeName} {\n${fieldLines.join('\n')}\n}`)
    } else if (ast.kind === 'UnionTypeDefinition') {
      const unionType = typeDef as GraphQLUnionType
      const members = unionType.getTypes().map((t) => t.name)
      parts.push(`union ${typeName} =\n  | ${members.join('\n  | ')}`)
    } else if (ast.kind === 'EnumTypeDefinition') {
      const enumType = typeDef as GraphQLEnumType
      const values = enumType.getValues().map((v) => `  ${v.name}`)
      parts.push(`enum ${typeName} {\n${values.join('\n')}\n}`)
    } else if (ast.kind === 'ScalarTypeDefinition') {
      parts.push(`scalar ${typeName}`)
    }
  }

  return parts.join('\n\n') + '\n'
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main(): Promise<void> {
  console.log('Reading schema...')
  const schemaSource = fs.readFileSync(SCHEMA_PATH, 'utf-8')
  const originalLineCount = schemaSource.split('\n').length

  const schema = buildSchema(schemaSource)

  console.log('Finding TypeScript source files...')
  const tsFiles = findTsFiles(SRC_DIR)
  console.log(`  Found ${tsFiles.length} files`)

  console.log('Extracting gql() template literals...')
  const allGqlStrings: string[] = []
  for (const file of tsFiles) {
    const content = fs.readFileSync(file, 'utf-8')
    allGqlStrings.push(...extractGqlStrings(content))
  }
  console.log(`  Found ${allGqlStrings.length} gql() template literals`)

  console.log('Parsing GraphQL documents...')
  const docs: DocumentNode[] = []
  for (const str of allGqlStrings) {
    try {
      docs.push(parse(str))
    } catch (e) {
      console.warn(`  Warning: failed to parse gql string: ${String(e).slice(0, 80)}`)
    }
  }

  console.log('Collecting used root fields...')
  const usedRootFields = collectUsedRootFields(docs)
  console.log(`  Used root fields (${usedRootFields.size}):`)
  for (const f of [...usedRootFields].sort()) {
    console.log(`    ${f}`)
  }

  console.log('Computing reachable types via BFS...')
  const reachable = collectReachableTypes(schema, usedRootFields)
  console.log(`  Reachable named types: ${reachable.size}`)

  console.log('Emitting pruned schema...')
  const output = emitPrunedSchema(schema, reachable, usedRootFields)
  fs.writeFileSync(SCHEMA_PATH, output)

  const newLineCount = output.split('\n').length
  console.log(`\nDone!`)
  console.log(`  Before: ${originalLineCount} lines`)
  console.log(`  After:  ${newLineCount} lines`)
  console.log(`  Wrote to: ${SCHEMA_PATH}`)
}

main().catch((err: unknown) => {
  console.error(err)
  process.exit(1)
})
