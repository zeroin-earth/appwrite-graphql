/**
 * Setup script for integration tests.
 * Creates admin account, project, API key, database, and collections.
 * Run this once before tests: `bun run tests/setup/setup.ts`
 */
import { Client, Databases, ID, Permission, Role } from 'node-appwrite'

const ENDPOINT = process.env.APPWRITE_ENDPOINT || 'http://localhost/v1'
const ADMIN_EMAIL = 'admin@test.local'
const ADMIN_PASSWORD = 'password123456'
const PROJECT_ID = 'test-project'
const DATABASE_ID = 'test-db'
const COLLECTION_ID = 'test-collection'

const ALL_SCOPES = [
  'users.read', 'users.write',
  'teams.read', 'teams.write',
  'databases.read', 'databases.write',
  'collections.read', 'collections.write',
  'attributes.read', 'attributes.write',
  'indexes.read', 'indexes.write',
  'documents.read', 'documents.write',
  'files.read', 'files.write',
  'buckets.read', 'buckets.write',
  'functions.read', 'functions.write',
  'execution.read', 'execution.write',
  'locale.read',
  'avatars.read',
  'health.read',
  'sessions.write',
]

async function waitForAppwrite(maxRetries = 60) {
  console.log(`Waiting for Appwrite at ${ENDPOINT}...`)
  for (let i = 0; i < maxRetries; i++) {
    try {
      // Use /locale instead of /health — it doesn't require auth scopes
      const resp = await fetch(`${ENDPOINT}/locale`)
      if (resp.ok) {
        console.log('Appwrite is ready!')
        return
      }
    } catch {
      // Not ready yet
    }
    await new Promise((r) => setTimeout(r, 2000))
  }
  throw new Error('Appwrite failed to start')
}

async function createAdminAccount(): Promise<string> {
  console.log('Creating admin account...')
  const resp = await fetch(`${ENDPOINT}/account`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Appwrite-Project': 'console',
    },
    body: JSON.stringify({
      userId: ID.unique(),
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      name: 'Test Admin',
    }),
  })

  if (!resp.ok) {
    const body = await resp.text()
    if (body.includes('already exists') || body.includes('user_already_exists') || body.includes('user_console_count_exceeded')) {
      console.log('Admin account already exists, logging in...')
      return loginAdmin()
    }
    throw new Error(`Failed to create admin: ${body}`)
  }

  // First account auto-gets a team; login to get session
  return loginAdmin()
}

async function loginAdmin(): Promise<string> {
  const resp = await fetch(`${ENDPOINT}/account/sessions/email`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Appwrite-Project': 'console',
    },
    body: JSON.stringify({
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
    }),
  })

  if (!resp.ok) {
    throw new Error(`Failed to login admin: ${await resp.text()}`)
  }

  const cookies = resp.headers.getSetCookie?.() || []
  const cookieStr = cookies.map((c) => c.split(';')[0]).join('; ')

  if (!cookieStr) {
    // Fallback: try set-cookie header
    const sc = resp.headers.get('set-cookie') || ''
    return sc.split(';')[0]
  }

  return cookieStr
}

async function getOrCreateTeam(cookies: string): Promise<string> {
  // Check for existing teams
  const listResp = await fetch(`${ENDPOINT}/teams`, {
    headers: {
      'X-Appwrite-Project': 'console',
      Cookie: cookies,
    },
  })

  if (!listResp.ok) {
    throw new Error(`Failed to list teams: ${await listResp.text()}`)
  }

  const data = (await listResp.json()) as { teams: Array<{ $id: string }> }
  if (data.teams.length) {
    return data.teams[0].$id
  }

  // No teams exist — create one
  console.log('No teams found, creating organization...')
  const createResp = await fetch(`${ENDPOINT}/teams`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Appwrite-Project': 'console',
      Cookie: cookies,
    },
    body: JSON.stringify({
      teamId: ID.unique(),
      name: 'Test Organization',
    }),
  })

  if (!createResp.ok) {
    throw new Error(`Failed to create team: ${await createResp.text()}`)
  }

  const team = (await createResp.json()) as { $id: string }
  console.log(`Team "${team.$id}" created`)
  return team.$id
}

async function createProject(cookies: string, teamId: string) {
  console.log('Creating test project...')
  const resp = await fetch(`${ENDPOINT}/projects`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Appwrite-Project': 'console',
      Cookie: cookies,
    },
    body: JSON.stringify({
      projectId: PROJECT_ID,
      name: 'Test Project',
      teamId,
    }),
  })

  if (!resp.ok) {
    const body = await resp.text()
    if (body.includes('already exists') || body.includes('project_already_exists')) {
      console.log('Project already exists')
      // Still ensure web platform is registered
      await registerWebPlatform(cookies)
      return
    }
    throw new Error(`Failed to create project: ${body}`)
  }

  console.log(`Project "${PROJECT_ID}" created`)

  // Register web platform to allow localhost origins
  await registerWebPlatform(cookies)
}

async function registerWebPlatform(cookies: string) {
  console.log('Registering web platform...')
  const resp = await fetch(`${ENDPOINT}/projects/${PROJECT_ID}/platforms`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Appwrite-Project': 'console',
      Cookie: cookies,
    },
    body: JSON.stringify({
      type: 'web',
      name: 'Test Web Platform',
      hostname: 'localhost',
    }),
  })

  if (!resp.ok) {
    const body = await resp.text()
    if (body.includes('already exists') || body.includes('platform_already_exists')) {
      console.log('Web platform already exists')
      return
    }
    // Non-fatal: tests may still work if platform exists
    console.warn(`Warning: Failed to register web platform: ${body}`)
    return
  }

  console.log('Web platform registered')
}

async function createApiKey(cookies: string): Promise<string> {
  console.log('Creating API key...')
  const resp = await fetch(`${ENDPOINT}/projects/${PROJECT_ID}/keys`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Appwrite-Project': 'console',
      Cookie: cookies,
    },
    body: JSON.stringify({
      name: 'Integration Test Key',
      scopes: ALL_SCOPES,
    }),
  })

  if (!resp.ok) {
    throw new Error(`Failed to create API key: ${await resp.text()}`)
  }

  const data = (await resp.json()) as { secret: string }
  console.log('API key created')
  return data.secret
}

async function setupDatabase(apiKey: string) {
  console.log('Setting up database and collections...')
  const client = new Client().setEndpoint(ENDPOINT).setProject(PROJECT_ID).setKey(apiKey)

  const databases = new Databases(client)

  // Create database
  try {
    await databases.create(DATABASE_ID, 'Test Database')
    console.log(`Database "${DATABASE_ID}" created`)
  } catch (e: any) {
    if (e?.code === 409) {
      console.log('Database already exists')
    } else {
      throw e
    }
  }

  // Create collection with document-level permissions
  try {
    await databases.createCollection(DATABASE_ID, COLLECTION_ID, 'Test Collection', [
      Permission.read(Role.any()),
      Permission.create(Role.users()),
      Permission.update(Role.users()),
      Permission.delete(Role.users()),
    ])
    console.log(`Collection "${COLLECTION_ID}" created`)
  } catch (e: any) {
    if (e?.code === 409) {
      console.log('Collection already exists')
      return
    }
    throw e
  }

  // Create attributes
  await databases.createStringAttribute(DATABASE_ID, COLLECTION_ID, 'name', 255, true)
  await databases.createIntegerAttribute(DATABASE_ID, COLLECTION_ID, 'age', false)
  await databases.createBooleanAttribute(DATABASE_ID, COLLECTION_ID, 'active', false)

  // Wait for attributes to be processed
  console.log('Waiting for attributes to be processed...')
  await new Promise((r) => setTimeout(r, 3000))

  console.log('Database setup complete!')
}

async function main() {
  await waitForAppwrite()

  const cookies = await createAdminAccount()
  const teamId = await getOrCreateTeam(cookies)
  await createProject(cookies, teamId)
  const apiKey = await createApiKey(cookies)
  await setupDatabase(apiKey)

  // Output env vars for tests
  console.log('\n=== Test Configuration ===')
  console.log(`APPWRITE_ENDPOINT=${ENDPOINT}`)
  console.log(`APPWRITE_PROJECT_ID=${PROJECT_ID}`)
  console.log(`APPWRITE_API_KEY=${apiKey}`)
  console.log('\nSetup complete! Run tests with:')
  console.log(
    `APPWRITE_ENDPOINT=${ENDPOINT} APPWRITE_PROJECT_ID=${PROJECT_ID} APPWRITE_API_KEY=${apiKey} bun test`,
  )

  // Write config to a file for test consumption
  const config = {
    endpoint: ENDPOINT,
    projectId: PROJECT_ID,
    apiKey,
    databaseId: DATABASE_ID,
    collectionId: COLLECTION_ID,
  }

  await Bun.write('tests/.test-config.json', JSON.stringify(config, null, 2))
  console.log('\nConfig written to tests/.test-config.json')
}

main().catch((e) => {
  console.error('Setup failed:', e)
  process.exit(1)
})
