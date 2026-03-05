import type { QueryClient } from '@tanstack/react-query'
import type { TadaDocumentNode } from 'gql.tada'

import { accountUpdateEmail } from '../../account/useUpdateEmail'
import { accountUpdateName } from '../../account/useUpdateName'
import { updatePassword } from '../../account/useUpdatePassword'
import { accountUpdatePhone } from '../../account/useUpdatePhone'
import { accountUpdatePrefs } from '../../account/useUpdatePrefs'
import type { AppwriteClient } from '../../client'
import { createDocument } from '../../databases/useCreateDocument'
import { decrementDocumentAttribute } from '../../databases/useDecrementAttribute'
import { deleteDocument } from '../../databases/useDeleteDocument'
import { incrementDocumentAttribute } from '../../databases/useIncrementAttribute'
import { updateDocument } from '../../databases/useUpdateDocument'
import { upsertDocument } from '../../databases/useUpsertDocument'
import { createSubscriber } from '../../messaging/useCreateSubscriber'
import { deleteSubscriber } from '../../messaging/useDeleteSubscriber'
import { Keys } from '../../query/Keys'
import { createMembership } from '../../teams/useCreateMembership'
import { createTeam } from '../../teams/useCreateTeam'
import { deleteMembership } from '../../teams/useDeleteMembership'
import { deleteTeam } from '../../teams/useDeleteTeam'
import { updateMembership } from '../../teams/useUpdateMembership'
import { updateTeamName } from '../../teams/useUpdateTeamName'
import { updateTeamPrefs } from '../../teams/useUpdateTeamPrefs'

type Vars = Record<string, unknown>
type MutationFn = (client: AppwriteClient, variables: Vars) => Promise<unknown>

/**
 * Creates a mutationFn that executes a GraphQL mutation and returns the
 * first field from the response data.
 */
function gqlMutation(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  query: TadaDocumentNode<any, any>,
  resultKey: string,
  options?: { serializeData?: boolean },
): MutationFn {
  return async (client, variables) => {
    const vars = options?.serializeData
      ? { ...variables, data: JSON.stringify(variables.data) }
      : variables

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, errors } = await client.graphql.mutation({ query, variables: vars as any })
    if (errors) throw errors
    return (data as Vars)[resultKey]
  }
}

type MutationEntry = {
  mutationKey: readonly string[]
  mutationFn: MutationFn
}

export const mutationRegistry: MutationEntry[] = [
  {
    mutationKey: Keys.databases().collections().documents().create(),
    mutationFn: gqlMutation(createDocument, 'databasesCreateDocument', { serializeData: true }),
  },
  {
    mutationKey: Keys.databases().collections().documents().update(),
    mutationFn: gqlMutation(updateDocument, 'databasesUpdateDocument', { serializeData: true }),
  },
  {
    mutationKey: Keys.databases().collections().documents().delete(),
    mutationFn: gqlMutation(deleteDocument, 'databasesDeleteDocument'),
  },
  {
    mutationKey: Keys.databases().collections().documents().upsert(),
    mutationFn: gqlMutation(upsertDocument, 'databasesUpsertDocument', { serializeData: true }),
  },

  {
    mutationKey: [...Keys.databases().transactions().operations().key(), 'incrementAttribute'],
    mutationFn: gqlMutation(incrementDocumentAttribute, 'databasesIncrementDocumentAttribute'),
  },

  {
    mutationKey: [...Keys.databases().transactions().operations().key(), 'decrementAttribute'],
    mutationFn: gqlMutation(decrementDocumentAttribute, 'databasesDecrementDocumentAttribute'),
  },

  {
    mutationKey: Keys.account().prefs().update(),
    mutationFn: gqlMutation(accountUpdatePrefs, 'accountUpdatePrefs'),
  },
  {
    mutationKey: Keys.account().name().update(),
    mutationFn: gqlMutation(accountUpdateName, 'accountUpdateName'),
  },
  {
    mutationKey: Keys.account().email().update(),
    mutationFn: gqlMutation(accountUpdateEmail, 'accountUpdateEmail'),
  },
  {
    mutationKey: Keys.account().password().update(),
    mutationFn: gqlMutation(updatePassword, 'accountUpdatePassword'),
  },
  {
    mutationKey: Keys.account().phone().update(),
    mutationFn: gqlMutation(accountUpdatePhone, 'accountUpdatePhone'),
  },

  { mutationKey: Keys.teams().create(), mutationFn: gqlMutation(createTeam, 'teamsCreate') },
  { mutationKey: Keys.teams().delete(), mutationFn: gqlMutation(deleteTeam, 'teamsDelete') },
  {
    mutationKey: Keys.teams().teamName().update(),
    mutationFn: gqlMutation(updateTeamName, 'teamsUpdateName'),
  },
  {
    mutationKey: Keys.teams().teamPrefs().update(),
    mutationFn: gqlMutation(updateTeamPrefs, 'teamsUpdatePrefs'),
  },
  {
    mutationKey: Keys.teams().memberships().create(),
    mutationFn: gqlMutation(createMembership, 'teamsCreateMembership'),
  },
  {
    mutationKey: Keys.teams().memberships().delete(),
    mutationFn: gqlMutation(deleteMembership, 'teamsDeleteMembership'),
  },
  {
    mutationKey: Keys.teams().memberships().update(),
    mutationFn: gqlMutation(updateMembership, 'teamsUpdateMembership'),
  },

  {
    mutationKey: Keys.messaging().subscriber().create(),
    mutationFn: gqlMutation(createSubscriber, 'messagingCreateSubscriber'),
  },
  {
    mutationKey: Keys.messaging().subscriber().delete(),
    mutationFn: gqlMutation(deleteSubscriber, 'messagingDeleteSubscriber'),
  },
]

/**
 * Registers all mutation defaults with the QueryClient so that
 * dehydrated/persisted mutations can be replayed on app restart.
 *
 * Call once during app initialization, before rehydrating the persisted
 * mutation cache.
 */
export function hydrateMutationDefaults(queryClient: QueryClient, client: AppwriteClient) {
  for (const entry of mutationRegistry) {
    queryClient.setMutationDefaults(entry.mutationKey, {
      mutationFn: (variables: Vars) => entry.mutationFn(client, variables),
    })
  }
}
