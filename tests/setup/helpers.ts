import { existsSync, readFileSync } from 'node:fs'
import { Client, Account, Databases, Users, ID } from 'node-appwrite'

type TestConfig = {
  endpoint: string
  projectId: string
  apiKey: string
  databaseId: string
  collectionId: string
}

let _config: TestConfig | null = null

export function getTestConfig(): TestConfig {
  if (_config) return _config

  // Try reading from config file first
  const configPath = 'tests/.test-config.json'
  if (existsSync(configPath)) {
    _config = JSON.parse(readFileSync(configPath, 'utf-8'))
    return _config!
  }

  // Fall back to env vars
  _config = {
    endpoint: process.env.APPWRITE_ENDPOINT || 'http://localhost/v1',
    projectId: process.env.APPWRITE_PROJECT_ID || 'test-project',
    apiKey: process.env.APPWRITE_API_KEY || '',
    databaseId: process.env.APPWRITE_DATABASE_ID || 'test-db',
    collectionId: process.env.APPWRITE_COLLECTION_ID || 'test-collection',
  }
  return _config
}

/** Create a server-side Appwrite client with API key */
export function createServerClient() {
  const config = getTestConfig()
  const client = new Client().setEndpoint(config.endpoint).setProject(config.projectId).setKey(config.apiKey)

  return {
    client,
    databases: new Databases(client),
    users: new Users(client),
    account: new Account(client),
  }
}

let _userCounter = 0

/** Create a unique test user and return credentials */
export async function createTestUser(opts?: { name?: string }) {
  _userCounter++
  const suffix = `${Date.now()}-${_userCounter}`
  const email = `test-${suffix}@test.local`
  const password = 'testpassword123456'
  const name = opts?.name || `Test User ${_userCounter}`

  const { users } = createServerClient()
  const user = await users.create(ID.unique(), email, undefined, password, name)

  return { userId: user.$id, email, password, name }
}

/** Delete a test user by ID */
export async function deleteTestUser(userId: string) {
  const { users } = createServerClient()
  try {
    await users.delete(userId)
  } catch {
    // User may already be deleted
  }
}

/** Create a test document via server SDK */
export async function createTestDocument(data: Record<string, unknown>, documentId?: string) {
  const config = getTestConfig()
  const { databases } = createServerClient()

  return databases.createDocument(config.databaseId, config.collectionId, documentId || ID.unique(), data)
}

/** Delete a test document via server SDK */
export async function deleteTestDocument(documentId: string) {
  const config = getTestConfig()
  const { databases } = createServerClient()
  try {
    await databases.deleteDocument(config.databaseId, config.collectionId, documentId)
  } catch {
    // Document may already be deleted
  }
}

/** Wait for a condition to be true, with timeout */
export async function waitFor(fn: () => boolean | Promise<boolean>, timeoutMs = 10000, intervalMs = 100) {
  const start = Date.now()
  while (Date.now() - start < timeoutMs) {
    if (await fn()) return
    await new Promise((r) => setTimeout(r, intervalMs))
  }
  throw new Error(`waitFor timed out after ${timeoutMs}ms`)
}
