import { act, renderHook, waitFor as waitForTest } from '@testing-library/react'
import { expect } from 'bun:test'
import { MailpitClient } from 'mailpit-api'
import { existsSync, readFileSync } from 'node:fs'
import { Account, Client, Databases, ID, Messaging, TablesDB, Users } from 'node-appwrite'
import { TOTP } from 'otpauth'

import type { createWrapper } from './wrapper'
import {
  useCreateMfaAuthenticator,
  useLogin,
  useLogout,
  useUpdateMfa,
  useUpdateMfaAuthenticator,
} from '../../src'

export type TestConfig = {
  endpoint: string
  projectId: string
  apiKey: string
  databaseId: string
  collectionId: string
  bucketId: string
  smtpProviderId: string
  smsProviderId: string
  topicId: string
}

let _config: TestConfig | null = null

const mailpit = new MailpitClient('http://localhost:8025')

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
    bucketId: 'test-bucket',
    smtpProviderId: 'test-smtp',
    smsProviderId: 'test-sms',
    topicId: 'test-topic',
  }
  return _config
}

/** Create a server-side Appwrite client with API key */
export function createServerClient() {
  const config = getTestConfig()
  const client = new Client()
    .setEndpoint(config.endpoint)
    .setProject(config.projectId)
    .setKey(config.apiKey)

  return {
    client,
    databases: new Databases(client),
    users: new Users(client),
    account: new Account(client),
    tablesDB: new TablesDB(client),
    messaging: new Messaging(client),
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
  const user = await users.create({ userId: ID.unique(), email, password, name })

  return { userId: user.$id, email, password, name }
}

/** Delete a test user by ID */
export async function deleteTestUser(userId: string) {
  const { users } = createServerClient()
  try {
    await users.delete({ userId })
  } catch {
    // User may already be deleted
  }
}

/** Create a test document via server SDK */
export async function createTestDocument(data: Record<string, unknown>, documentId?: string) {
  const config = getTestConfig()
  const { tablesDB } = createServerClient()

  return tablesDB.createRow({
    databaseId: config.databaseId,
    tableId: config.collectionId,
    rowId: documentId || ID.unique(),
    data,
  })
}

/** Delete a test document via server SDK */
export async function deleteTestDocument(documentId: string) {
  const config = getTestConfig()
  const { tablesDB } = createServerClient()
  try {
    await tablesDB.deleteRow({
      databaseId: config.databaseId,
      tableId: config.collectionId,
      rowId: documentId,
    })
  } catch {
    // Document may already be deleted
  }
}

/** Wait for a condition to be true, with timeout */
export async function waitFor(
  fn: () => boolean | Promise<boolean>,
  timeoutMs = 10000,
  intervalMs = 100,
) {
  const start = Date.now()
  while (Date.now() - start < timeoutMs) {
    if (await fn()) return
    await new Promise((r) => setTimeout(r, intervalMs))
  }
  throw new Error(`waitFor timed out after ${timeoutMs}ms`)
}

/** Get a user's email target ID via server SDK */
export async function getUserEmailTargetId(userId: string): Promise<string> {
  const { users } = createServerClient()
  const user = await users.get({ userId })
  const emailTarget = user.targets.find((t: any) => t.providerType === 'email')
  if (!emailTarget) {
    throw new Error(`No email target found for user ${userId}`)
  }
  return emailTarget.$id
}

/** Send a test email to a topic via server SDK and wait for delivery */
export async function sendTopicEmail(opts: {
  topicId: string
  subject: string
  content: string
}): Promise<string> {
  const { messaging } = createServerClient()
  const msg = await messaging.createEmail({
    messageId: ID.unique(),
    subject: opts.subject,
    content: opts.content,
    topics: [opts.topicId],
  })

  // Poll for delivery (max 10s)
  for (let i = 0; i < 10; i++) {
    await new Promise((r) => setTimeout(r, 1000))
    const status = await messaging.getMessage({ messageId: msg.$id })
    if (status.status !== 'processing') break
  }

  return msg.$id
}

export function generateTOTP(secret: string): string {
  const totp = new TOTP({ secret, algorithm: 'SHA1', digits: 6, period: 30 })
  return totp.generate()
}

export async function setupOTP(wrapper: ReturnType<typeof createWrapper>) {
  const { result } = renderHook(() => useUpdateMfa(), { wrapper })

  await act(async () => {
    await result.current.mutateAsync({ mfa: true })
  })

  await waitForTest(() => expect(result.current.isSuccess).toBe(true))

  const { result: createMfaAuthenticatorResult } = renderHook(() => useCreateMfaAuthenticator(), {
    wrapper,
  })
  await act(async () => {
    await createMfaAuthenticatorResult.current.mutateAsync({ type: 'totp' })
  })
  await waitForTest(() => expect(createMfaAuthenticatorResult.current.isSuccess).toBe(true))

  const totpSecret = createMfaAuthenticatorResult.current.data?.secret || ''
  const otp = generateTOTP(totpSecret)

  const { result: updateMfaAuthenticatorResult } = renderHook(() => useUpdateMfaAuthenticator(), {
    wrapper,
  })

  await act(async () => {
    await updateMfaAuthenticatorResult.current.mutateAsync({ type: 'totp', otp })
  })

  await waitForTest(() => expect(updateMfaAuthenticatorResult.current.isSuccess).toBe(true))

  return { totpSecret }
}

export async function loginUser(
  email: string,
  password: string,
  wrapper: ReturnType<typeof createWrapper>,
): Promise<void> {
  const { result } = renderHook(() => useLogin(), { wrapper })

  await act(async () => {
    await result.current.login.mutateAsync({ email, password })
  })

  await waitForTest(() => expect(result.current.login.isSuccess).toBe(true))
}

export async function logoutUser(wrapper: ReturnType<typeof createWrapper>): Promise<void> {
  const { result } = renderHook(() => useLogout(), { wrapper })
  await act(async () => {
    await result.current.mutateAsync({ sessionId: 'current' })
  })
  await waitForTest(() => expect(result.current.isSuccess).toBe(true))
}

export async function checkMail() {
  const emails = await mailpit.listMessages()
  return emails
}

export async function renderMessage(messageId: string) {
  const content = await mailpit.renderMessageHTML(messageId)
  document.body.innerHTML = content
  return content
}

export async function emptyMail() {
  await mailpit.deleteMessages()
}

export async function getSMSMessages() {
  const messages = await fetch('http://localhost:8888/messages').then((res) => res.json())
  return messages
}

export async function clearSMSMessages() {
  await fetch('http://localhost:8888/messages', { method: 'DELETE' })
}
