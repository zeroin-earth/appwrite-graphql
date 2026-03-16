/**
 * Setup script for integration tests.
 * Creates admin account, project, API key, database, and collections.
 * Run this once before tests: `bun run tests/setup/setup.ts`
 */
import { Client, Databases, ID, Permission, Role, Runtime, TablesDB } from 'node-appwrite'

import type { TestConfig } from './helpers'

const ENDPOINT = process.env.APPWRITE_ENDPOINT || 'http://localhost/v1'
const ADMIN_EMAIL = 'admin@test.local'
const ADMIN_PASSWORD = 'password123456'
const PROJECT_ID = 'test-project'
const DATABASE_ID = 'test-db'
const COLLECTION_ID = 'test-collection'
const BUCKET_ID = 'test-bucket'
const SMTP_PROVIDER_ID = 'test-smtp'
const TOPIC_ID = 'test-topic'
const SMS_PROVIDER_ID = 'test-sms'

const ALL_SCOPES = [
  'users.read',
  'users.write',
  'teams.read',
  'teams.write',
  'databases.read',
  'databases.write',
  'collections.read',
  'collections.write',
  'attributes.read',
  'attributes.write',
  'indexes.read',
  'indexes.write',
  'documents.read',
  'documents.write',
  'files.read',
  'files.write',
  'buckets.read',
  'buckets.write',
  'functions.read',
  'functions.write',
  'execution.read',
  'execution.write',
  'locale.read',
  'avatars.read',
  'health.read',
  'sessions.write',
  'providers.read',
  'providers.write',
  'topics.write',
  'subscribers.read',
  'subscribers.write',
  'targets.read',
  'messages.read',
  'messages.write',
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
    if (
      body.includes('already exists') ||
      body.includes('user_already_exists') ||
      body.includes('user_console_count_exceeded')
    ) {
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

  const tablesDb = new TablesDB(client)
  const databases = new Databases(client)

  // Create database
  try {
    await tablesDb.create({ databaseId: DATABASE_ID, name: 'Test Database' })
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
    await tablesDb.createTable({
      databaseId: DATABASE_ID,
      tableId: COLLECTION_ID,
      name: 'Test Collection',
      permissions: [
        Permission.read(Role.any()),
        Permission.create(Role.users()),
        Permission.update(Role.users()),
        Permission.delete(Role.users()),
      ],
    })
    console.log(`Collection "${COLLECTION_ID}" created`)
  } catch (e: any) {
    if (e?.code === 409) {
      console.log('Collection already exists')
    } else {
      throw e
    }
  }

  // Create attributes via Databases API (TablesDB.createTable columns param is not supported)
  const attributes = [
    { method: 'createStringAttribute', params: { key: 'name', size: 255, required: true } },
    { method: 'createIntegerAttribute', params: { key: 'age', required: false } },
    { method: 'createBooleanAttribute', params: { key: 'active', required: false } },
  ] as const

  for (const attr of attributes) {
    try {
      await (databases[attr.method] as any)({
        databaseId: DATABASE_ID,
        collectionId: COLLECTION_ID,
        ...attr.params,
      })
      console.log(`Attribute "${attr.params.key}" created`)
    } catch (e: any) {
      if (e?.code === 409) {
        console.log(`Attribute "${attr.params.key}" already exists`)
      } else {
        throw e
      }
    }
  }

  // Wait for attributes to be processed
  console.log('Waiting for attributes to be processed...')
  await new Promise((r) => setTimeout(r, 3000))

  console.log('Database setup complete!')
}

async function setupBucket(apiKey: string) {
  console.log('Setting up storage bucket...')

  const resp = await fetch(`${ENDPOINT}/storage/buckets`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Appwrite-Project': PROJECT_ID,
      'X-Appwrite-Key': apiKey,
    },
    body: JSON.stringify({
      bucketId: BUCKET_ID,
      name: 'Test Bucket',
      fileSecurity: true,
      permissions: [
        Permission.read(Role.any()),
        Permission.create(Role.users()),
        Permission.update(Role.users()),
        Permission.delete(Role.users()),
      ],
    }),
  })

  if (!resp.ok) {
    const body = await resp.text()
    if (body.includes('already exists') || body.includes('storage_bucket_already_exists')) {
      console.log('Bucket already exists')
      return
    }
    throw new Error(`Failed to create bucket: ${body}`)
  }

  console.log(`Bucket "${BUCKET_ID}" created!`)
}

async function setupMessaging(apiKey: string) {
  console.log('Setting up messaging topics...')

  const resp = await fetch(`${ENDPOINT}/messaging/providers/smtp`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Appwrite-Project': PROJECT_ID,
      'X-Appwrite-Key': apiKey,
    },
    body: JSON.stringify({
      providerId: SMTP_PROVIDER_ID,
      name: 'Test SMTP Provider',
      host: 'host.docker.internal',
      port: 1025,
      secure: false,
      enabled: true,
      fromEmail: 'test@test.local',
      fromName: 'Test Sender',
    }),
  })

  if (!resp.ok) {
    const body = await resp.text()
    if (body.includes('already exists') || body.includes('messaging_provider_already_exists')) {
      console.log('Messaging provider already exists, updating...')
      const updateResp = await fetch(`${ENDPOINT}/messaging/providers/smtp/${SMTP_PROVIDER_ID}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'X-Appwrite-Project': PROJECT_ID,
          'X-Appwrite-Key': apiKey,
        },
        body: JSON.stringify({
          enabled: true,
          fromEmail: 'test@test.local',
          fromName: 'Test Sender',
          host: 'host.docker.internal',
          port: 1025,
        }),
      })
      if (!updateResp.ok) {
        console.warn(`Warning: Failed to update provider: ${await updateResp.text()}`)
      }
    } else {
      throw new Error(`Failed to create messaging provider: ${body}`)
    }
  }

  console.log('SMTP provider created!')

  const smsResp = await fetch(`${ENDPOINT}/messaging/providers/twilio`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Appwrite-Project': PROJECT_ID,
      'X-Appwrite-Key': apiKey,
    },
    body: JSON.stringify({
      providerId: SMS_PROVIDER_ID,
      name: 'Test Twilio SMS Provider',
      accountSid: 'test',
      enabled: true,
    }),
  })

  if (!smsResp.ok) {
    const body = await smsResp.text()
    if (body.includes('already exists') || body.includes('messaging_provider_already_exists')) {
      console.log('SMS provider already exists, updating...')
      const updateResp = await fetch(`${ENDPOINT}/messaging/providers/twilio/${SMS_PROVIDER_ID}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'X-Appwrite-Project': PROJECT_ID,
          'X-Appwrite-Key': apiKey,
        },
        body: JSON.stringify({
          enabled: true,
          accountSid: 'test',
        }),
      })
      if (!updateResp.ok) {
        console.warn(`Warning: Failed to update SMS provider: ${await updateResp.text()}`)
      }
    } else {
      throw new Error(`Failed to create SMS provider: ${body}`)
    }
  }

  console.log('SMS provider created!')

  // Create a topic
  console.log('Creating messaging topic...')

  const topicResp = await fetch(`${ENDPOINT}/messaging/topics`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Appwrite-Project': PROJECT_ID,
      'X-Appwrite-Key': apiKey,
    },
    body: JSON.stringify({
      topicId: TOPIC_ID,
      name: 'Test Topic',
    }),
  })

  if (!topicResp.ok) {
    const body = await topicResp.text()
    if (body.includes('already exists') || body.includes('messaging_topic_already_exists')) {
      console.log('Messaging topic already exists')
      return
    }
    throw new Error(`Failed to create messaging topic: ${body}`)
  }

  console.log('Messaging topic created!')
}

async function deployFunction(apiKey: string) {
  console.log('Deploying test function...')

  const resp = await fetch(`${ENDPOINT}/functions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Appwrite-Project': PROJECT_ID,
      'X-Appwrite-Key': apiKey,
    },
    body: JSON.stringify({
      functionId: 'test-function',
      name: 'Test Function',
      execute: [Role.any()],
      runtime: Runtime.Node22,
      enabled: true,
      entrypoint: 'index.js',
      commands: 'npm i',
    }),
  })

  if (!resp.ok) {
    const body = await resp.text()
    if (body.includes('already exists') || body.includes('function_already_exists')) {
      console.log('Function already exists, skipping deployment')
      return
    } else {
      const runtimes = await fetch(`${ENDPOINT}/functions/runtimes`, {
        headers: {
          'X-Appwrite-Project': PROJECT_ID,
        },
      }).then((r) => r.json())
      console.error('Available runtimes:', runtimes)
      throw new Error(`Failed to create function: ${body}`)
    }
  }

  //@ts-expect-error - FormData types are wrong
  const codePath = new URL('./code.tar.gz', import.meta.url)
  const codeFile = Bun.file(codePath)
  const formData = new FormData()
  formData.append('functionId', 'test-function')
  formData.append('code', codeFile, 'code.tar.gz')
  formData.append('activate', 'true')

  const deployResp = await fetch(`${ENDPOINT}/functions/test-function/deployments`, {
    method: 'POST',
    headers: {
      'X-Appwrite-Project': PROJECT_ID,
      'X-Appwrite-Key': apiKey,
    },
    body: formData,
  })

  if (!deployResp.ok) {
    throw new Error(`Failed to deploy function: ${await deployResp.text()}`)
  }

  const deployment = await deployResp.json()

  const deploymentId = deployment.$id
  console.log('Waiting for deployment to be ready...')

  for (let i = 0; i < 5; i++) {
    const checkDeploymentStatus = await fetch(
      `${ENDPOINT}/functions/test-function/deployments/${deploymentId}`,
      {
        headers: {
          'X-Appwrite-Project': PROJECT_ID,
          'X-Appwrite-Key': apiKey,
        },
      },
    ).then((r) => r.json())

    if (checkDeploymentStatus.status !== 'ready') {
      await new Promise((r) => setTimeout(r, 3000))
    } else {
      console.log('Deployment is ready!')
      break
    }
  }

  console.log(`Deployment "${deploymentId}" created, activating...`)

  const setDeployment = await fetch(`${ENDPOINT}/functions/test-function/deployment`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'X-Appwrite-Project': PROJECT_ID,
      'X-Appwrite-Key': apiKey,
    },
    body: JSON.stringify({
      functionId: 'test-function',
      deploymentId,
    }),
  })

  if (!setDeployment.ok) {
    const theDeplymnet = await fetch(
      `${ENDPOINT}/functions/test-function/deployments/${deploymentId}`,
      {
        headers: {
          'X-Appwrite-Project': PROJECT_ID,
          'X-Appwrite-Key': apiKey,
        },
      },
    ).then((r) => r.json())
    console.log('Deployment details:', theDeplymnet)

    console.error(`Failed to set active deployment: ${deploymentId}`)
    throw new Error(`Failed to set active deployment: ${await setDeployment.text()}`)
  }

  console.log('Function created!')
}

async function main() {
  await waitForAppwrite()

  const cookies = await createAdminAccount()
  const teamId = await getOrCreateTeam(cookies)
  await createProject(cookies, teamId)
  const apiKey = await createApiKey(cookies)
  await setupDatabase(apiKey)
  await setupBucket(apiKey)
  await setupMessaging(apiKey)
  await deployFunction(apiKey)

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
  const config: TestConfig = {
    endpoint: ENDPOINT,
    projectId: PROJECT_ID,
    apiKey,
    databaseId: DATABASE_ID,
    collectionId: COLLECTION_ID,
    bucketId: BUCKET_ID,
    smtpProviderId: SMTP_PROVIDER_ID,
    smsProviderId: SMS_PROVIDER_ID,
    topicId: TOPIC_ID,
  }

  await Bun.write('tests/.test-config.json', JSON.stringify(config, null, 2))
  console.log('\nConfig written to tests/.test-config.json')
}

main().catch((e) => {
  console.error('Setup failed:', e)
  process.exit(1)
})
