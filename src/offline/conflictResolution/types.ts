import type { Models } from 'appwrite'

export type ConflictStrategy =
  | 'last-write-wins'
  | 'server-wins' // discard local mutation, keep remote
  | 'merge-shallow' // { ...remote.data, ...local.data }
  | ((context: ConflictContext) => Record<string, string | number | boolean | null> | 'abort')

export type ConflictContext = {
  base: Models.DefaultDocument // snapshot from when mutation was created
  remote: Models.DefaultDocument // current server state (fetched at replay time)
  local: Models.DefaultDocument // what the user wanted to write
  mutationKey: string[]
}
