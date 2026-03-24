import {
  Avatars,
  type Channel,
  Client,
  Functions,
  Graphql,
  ID,
  type Query,
  type RealtimeResponseEvent,
  type RealtimeSubscription,
} from 'appwrite'
import type { ActionableChannel, ResolvedChannel } from 'appwrite/types/channel'
import { mock } from 'bun:test'

const subscriptions = new Map<string[], (event: RealtimeResponseEvent<any>) => void>()

class Realtime {
  subscribe(
    channel: string | Channel<any> | ActionableChannel | ResolvedChannel,
    callback: (event: RealtimeResponseEvent<any>) => void,
    queries?: (string | Query)[],
  ): Promise<RealtimeSubscription> {
    const key = [channel.toString(), ...(queries ?? []).map((q) => q.toString())]
    subscriptions.set(key, callback)
    return Promise.resolve({
      close() {
        subscriptions.delete(key)
        return Promise.resolve()
      },
    } as unknown as RealtimeSubscription)
  }
}

mock.module('appwrite', () => {
  return {
    Realtime,
    Avatars,
    ID,
    Functions,
    Graphql,
    Client,
  }
})

export const triggerRealtimeEvent = (
  channel: string | Channel<any> | ActionableChannel | ResolvedChannel,
  payload: any,
  events?: string[],
) => {
  for (const [subChannels, callback] of subscriptions.entries()) {
    if (subChannels.includes(channel.toString())) {
      callback({
        channels: subChannels,
        payload,
        events: events ?? [],
        timestamp: new Date().toISOString(),
        subscriptions: subChannels,
      } as RealtimeResponseEvent<any>)
    }
  }
}
