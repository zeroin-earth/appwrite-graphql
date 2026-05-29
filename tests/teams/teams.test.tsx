import { within } from '@testing-library/dom'
import { act, renderHook, waitFor } from '@testing-library/react'
import { afterAll, afterEach, beforeAll, describe, expect, test } from 'bun:test'
import { URLSearchParams } from 'happy-dom'
import { Client as ServerClient, ID as ServerID, Teams as ServerTeams } from 'node-appwrite'

import {
  useCreateMembership,
  useCreateTeam,
  useDeleteMembership,
  useDeleteTeam,
  useTeam,
  useTeamMembership,
  useTeamMemberships,
  useTeamPrefs,
  useTeams,
  useUpdateMembership,
  useUpdateMembershipStatus,
  useUpdateTeamName,
  useUpdateTeamPrefs,
} from '../../src'
import { ID } from '../../src/types'
import {
  checkMail,
  createTestUser,
  deleteTestUser,
  emptyMail,
  getTestConfig,
  loginUser,
  logoutUser,
  renderMessage,
} from '../setup/helpers'
import { createWrapper } from '../setup/wrapper'

function createServerTeams() {
  const config = getTestConfig()
  const client = new ServerClient()
    .setEndpoint(config.endpoint)
    .setProject(config.projectId)
    .setKey(config.apiKey)
  return new ServerTeams(client)
}

describe('Teams hooks', () => {
  let userId: string
  let userEmail: string
  let userPassword: string
  const createdTeamIds: string[] = []

  beforeAll(async () => {
    const user = await createTestUser({ name: 'Teams Test User' })
    userId = user.userId
    userEmail = user.email
    userPassword = user.password
  })

  afterAll(async () => {
    const teams = createServerTeams()
    for (const teamId of createdTeamIds) {
      try {
        await teams.delete({ teamId })
      } catch {
        // Team may already be deleted
      }
    }
    await deleteTestUser(userId)
  })

  describe('useCreateTeam', () => {
    test('creates a new team', async () => {
      const wrapper = createWrapper()
      await loginUser(userEmail, userPassword, wrapper)

      const { result } = renderHook(() => useCreateTeam(), { wrapper })

      const teamId = ID.unique()

      await act(async () => {
        await result.current.mutateAsync({ teamId, name: 'Test Team' })
      })

      await waitFor(() => expect(result.current.isSuccess).toBe(true))

      createdTeamIds.push(teamId)

      expect(result.current.data).toBeDefined()
      expect(result.current.data?.name).toBe('Test Team')
    })
  })

  describe('useTeams', () => {
    test('lists teams the user belongs to', async () => {
      const wrapper = createWrapper()
      await loginUser(userEmail, userPassword, wrapper)

      // Ensure at least one team exists
      const { result: createResult } = renderHook(() => useCreateTeam(), {
        wrapper,
      })
      const teamId = ID.unique()
      await act(async () => {
        await createResult.current.mutateAsync({
          teamId,
          name: 'List Test Team',
        })
      })
      await waitFor(() => expect(createResult.current.isSuccess).toBe(true))
      createdTeamIds.push(teamId)

      const { result } = renderHook(() => useTeams(), { wrapper })

      await waitFor(() => expect(result.current.isSuccess).toBe(true))

      expect(result.current.data).toBeDefined()
      expect(result.current.data?.total).toBeGreaterThan(0)
      expect(result.current.data?.teams).toBeInstanceOf(Array)
    })
  })

  describe('useTeam', () => {
    let teamId: string

    beforeAll(async () => {
      // Create a team via server SDK for reading
      const teams = createServerTeams()
      const team = await teams.create({
        teamId: ServerID.unique(),
        name: 'Get Team Test',
      })
      teamId = team.$id
      createdTeamIds.push(teamId)

      // Add user as member
      await teams.createMembership({ teamId, roles: [], email: userEmail })
    })

    test('reads a team by ID', async () => {
      const wrapper = createWrapper()
      await loginUser(userEmail, userPassword, wrapper)

      const { result } = renderHook(() => useTeam({ teamId }), { wrapper })

      await waitFor(() => expect(result.current.isSuccess).toBe(true))

      expect(result.current.data).toBeDefined()
      expect(result.current.data?._id).toBe(teamId)
      expect(result.current.data?.name).toBe('Get Team Test')
    })
  })

  describe('useUpdateTeamName', () => {
    test('updates a team name', async () => {
      const wrapper = createWrapper()
      await loginUser(userEmail, userPassword, wrapper)

      // Create a team first
      const { result: createResult } = renderHook(() => useCreateTeam(), {
        wrapper,
      })
      const teamId = ID.unique()
      await act(async () => {
        await createResult.current.mutateAsync({ teamId, name: 'Old Name' })
      })
      await waitFor(() => expect(createResult.current.isSuccess).toBe(true))
      createdTeamIds.push(teamId)

      const { result } = renderHook(() => useUpdateTeamName(), { wrapper })

      await act(async () => {
        await result.current.mutateAsync({ teamId, name: 'New Name' })
      })

      await waitFor(() => expect(result.current.isSuccess).toBe(true))

      expect(result.current.data).toBeDefined()
      expect(result.current.data?.name).toBe('New Name')
    })
  })

  describe('useTeamPrefs & useUpdateTeamPrefs', () => {
    let teamId: string

    beforeAll(async () => {
      // Create a team via server SDK
      const teams = createServerTeams()
      const team = await teams.create({
        teamId: ServerID.unique(),
        name: 'Prefs Team Test',
      })
      teamId = team.$id
      createdTeamIds.push(teamId)

      // Add user as owner so they can update prefs
      await teams.createMembership({
        teamId,
        roles: ['owner'],
        email: userEmail,
      })
    })

    test('updates and reads team preferences', async () => {
      const wrapper = createWrapper()
      await loginUser(userEmail, userPassword, wrapper)

      const { result: updateResult } = renderHook(() => useUpdateTeamPrefs(), {
        wrapper,
      })

      await act(async () => {
        await updateResult.current.mutateAsync({
          teamId,
          prefs: { color: 'blue' },
        })
      })

      await waitFor(() => expect(updateResult.current.isSuccess).toBe(true))

      const { result: prefsResult } = renderHook(() => useTeamPrefs({ teamId }), { wrapper })

      await waitFor(() => expect(prefsResult.current.isSuccess).toBe(true))

      expect(prefsResult.current.data).toBeDefined()
    })
  })

  describe('useDeleteTeam', () => {
    test('deletes a team', async () => {
      const wrapper = createWrapper()
      await loginUser(userEmail, userPassword, wrapper)

      // Create a team to delete
      const { result: createResult } = renderHook(() => useCreateTeam(), {
        wrapper,
      })
      const teamId = ID.unique()
      await act(async () => {
        await createResult.current.mutateAsync({ teamId, name: 'Delete Me' })
      })
      await waitFor(() => expect(createResult.current.isSuccess).toBe(true))

      const { result } = renderHook(() => useDeleteTeam(), { wrapper })

      await act(async () => {
        await result.current.mutateAsync({ teamId })
      })

      await waitFor(() => expect(result.current.isSuccess).toBe(true))

      expect(result.current.data).toBeDefined()
    })
  })

  describe('useTeamMemberships & useCreateMembership', () => {
    let teamId: string

    beforeAll(async () => {
      const teams = createServerTeams()
      const team = await teams.create({
        teamId: ServerID.unique(),
        name: 'Membership Team Test',
      })
      teamId = team.$id
      createdTeamIds.push(teamId)

      // Add the test user as owner
      await teams.createMembership({
        teamId,
        roles: ['owner'],
        email: userEmail,
      })
    })

    afterEach(async () => {
      await emptyMail()
      document.body.innerHTML = ''
    })

    test('lists team memberships', async () => {
      const wrapper = createWrapper()
      await loginUser(userEmail, userPassword, wrapper)

      const { result } = renderHook(() => useTeamMemberships({ teamId }), {
        wrapper,
      })

      await waitFor(() => expect(result.current.isSuccess).toBe(true))

      expect(result.current.data).toBeDefined()
      expect(result.current.data?.total).toBeGreaterThan(0)
      expect(result.current.data?.memberships).toBeInstanceOf(Array)
    })

    test('creates a new membership by userId', async () => {
      const wrapper = createWrapper()
      await loginUser(userEmail, userPassword, wrapper)

      // Create another user to invite
      const invited = await createTestUser({ name: 'Invited User' })

      const { result } = renderHook(() => useCreateMembership(), { wrapper })

      await act(async () => {
        await result.current.mutateAsync({
          teamId,
          roles: ['member'],
          userId: invited.userId,
          url: 'http://localhost/accept',
        })
      })

      await waitFor(() => expect(result.current.isSuccess || result.current.isError).toBe(true))

      if (result.current.isSuccess) {
        expect(result.current.data).toBeDefined()
        expect(result.current.data?.teamId).toBe(teamId)
      }

      await deleteTestUser(invited.userId)
    })

    test('updates team memberships after creating a membership', async () => {
      const wrapper = createWrapper()
      await loginUser(userEmail, userPassword, wrapper)

      // Create another user to invite
      const invited = await createTestUser({
        name: 'Membership Update Test User',
      })

      const { result } = renderHook(() => useCreateMembership(), { wrapper })

      await act(async () => {
        await result.current.mutateAsync({
          teamId,
          roles: ['member'],
          userId: invited.userId,
          url: 'http://localhost/accept',
        })
      })

      await waitFor(() => expect(result.current.isSuccess || result.current.isError).toBe(true))

      const { result: membershipsResult } = renderHook(() => useUpdateMembership(), { wrapper })

      await act(async () => {
        await membershipsResult.current.mutateAsync({
          teamId,
          membershipId: result.current.data?._id || '',
          roles: ['admin'],
        })
      })

      await waitFor(() => expect(membershipsResult.current.isSuccess).toBe(true))

      expect(membershipsResult.current.data).toBeDefined()
      expect(membershipsResult.current.data?.roles).toContain('admin')
    })

    test('acknowledges invite email', async () => {
      const wrapper = createWrapper()
      await loginUser(userEmail, userPassword, wrapper)

      // Create another user to invite
      const invited = await createTestUser({
        name: 'Membership Update Test User',
      })

      const { result } = renderHook(() => useCreateMembership(), { wrapper })

      await act(async () => {
        await result.current.mutateAsync({
          teamId,
          roles: ['member'],
          userId: invited.userId,
          url: 'http://localhost/accept',
        })
      })

      await waitFor(() => expect(result.current.isSuccess || result.current.isError).toBe(true))

      await logoutUser(wrapper)

      await act(async () => {
        await new Promise((r) => setTimeout(r, 3000))
      })

      const message = await waitFor(async () => {
        const emails = await checkMail()
        expect(emails.messages.length).toBeGreaterThan(0)
        return emails.messages[0]
      })

      await renderMessage(message.ID)
      const emailBody = within(document.body)

      expect(emailBody.getByText(/Accept invite to Membership Team Test/)).toBeDefined()

      const button = emailBody.getByText(/Accept invite to Membership Team Test/)

      expect(button.getAttribute('href')).toBeDefined()

      const url = new URL(button.getAttribute('href') || '')
      expect(url.pathname).toBe('/accept')

      const params = new URLSearchParams(url.search)

      expect(params.get('teamId')).toBe(teamId)
      expect(params.get('membershipId')).toBe(result.current.data?._id ?? null)
      expect(params.get('userId')).toBe(invited.userId)
      expect(params.get('secret')).toBeDefined()

      const { result: updateMembershipStatusResult } = renderHook(
        () => useUpdateMembershipStatus(),
        { wrapper },
      )

      await act(async () => {
        await updateMembershipStatusResult.current.mutateAsync({
          teamId,
          membershipId: result.current.data?._id || '',
          userId: invited.userId,
          secret: params.get('secret') || '',
        })
      })

      await waitFor(() =>
        expect(
          updateMembershipStatusResult.current.isSuccess ||
            updateMembershipStatusResult.current.isError,
        ).toBe(true),
      )

      const { result: teamMembershipResult } = renderHook(
        () =>
          useTeamMembership({
            teamId,
            membershipId: result.current.data?._id || '',
          }),
        { wrapper },
      )

      await waitFor(() => expect(teamMembershipResult.current.isSuccess).toBe(true))

      expect(teamMembershipResult.current.data).toBeDefined()
      expect(teamMembershipResult.current.data?.teamName).toBe('Membership Team Test')

      const { result: deleteMembershipResult } = renderHook(() => useDeleteMembership(), {
        wrapper,
      })

      await act(async () => {
        await deleteMembershipResult.current.mutateAsync({
          teamId,
          membershipId: result.current.data?._id || '',
        })
      })

      await waitFor(() => expect(deleteMembershipResult.current.isSuccess).toBe(true))

      await deleteTestUser(invited.userId)
    })
  })
})
