import { Keys } from '../..'
import { getDocument } from '../../databases/queryOptions'
import { updateDocument } from '../../databases/useUpdateDocument'
import { resolveConflict } from '../conflictResolution/resolve'
import type { ConflictStrategy } from '../conflictResolution/types'
import type { MutationFn, Vars } from '../types'

/**
 * Creates a conflict-aware mutationFn for document updates.
 *
 * When a base snapshot is available (persisted in MutationState.context by
 * useUpdateDocument's onMutate), the function fetches the current remote
 * document, runs the configured conflict resolution strategy, and sends the
 * resolved data. If no base snapshot exists (e.g. the mutation was created
 * while online and executed immediately), it falls through to a normal update.
 */
export function conflictAwareUpdate(conflictStrategy: ConflictStrategy): MutationFn {
  return async (client, variables, queryClient) => {
    const { databaseId, collectionId, documentId } = variables as {
      databaseId: string
      collectionId: string
      documentId: string
    }

    // Look up the mutation instance to read the persisted onMutate context
    const mutation = queryClient
      .getMutationCache()
      .getAll()
      .find((m) => JSON.stringify(m.state.variables) === JSON.stringify(variables))

    const baseSnapshot = (mutation?.state.context as { baseSnapshot?: Record<string, unknown> })
      ?.baseSnapshot

    let resolvedData = variables.data as Record<string, unknown>
    if (baseSnapshot) {
      const { data: remoteResult, errors: fetchErrors } = await client.graphql.query({
        query: getDocument,
        variables: { databaseId, collectionId, documentId },
      })

      if (fetchErrors) throw fetchErrors

      const rawRemote = remoteResult.databasesGetDocument
      const remote = {
        ...rawRemote,
        ...(rawRemote ? (JSON.parse(rawRemote.data as string) as Record<string, unknown>) : {}),
      } as Record<string, unknown>
      delete remote.data // Remove the raw JSON string from the remote document
      delete remote._id // Remove the _id field to avoid confusion during conflict resolution

      // Build the "local" document: the base with the user's changes applied
      const local = {
        ...baseSnapshot,
        ...(variables.data as Record<string, unknown>),
      }

      const result = resolveConflict(
        {
          base: baseSnapshot as never,
          remote: remote as never,
          local: local as never,
          mutationKey: [databaseId, collectionId, documentId],
        },
        conflictStrategy,
      )

      if (result === 'abort') {
        await queryClient.setQueryData(
          Keys.database(databaseId).collection(collectionId).document(documentId).key(),
          remote,
        )
        return { _id: documentId }
      }

      resolvedData = result
    }

    const { data, errors } = await client.graphql.mutation({
      query: updateDocument,
      variables: {
        ...variables,
        data: JSON.stringify(resolvedData.data ?? resolvedData),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any,
    })

    const newData = (resolvedData.data ?? resolvedData) as Record<string, unknown>
    delete variables.data

    const thing = { ...baseSnapshot, ...newData, _id: documentId }

    await queryClient.setQueryData(
      Keys.database(databaseId).collection(collectionId).document(documentId).key(),
      (old: Record<string, unknown> | undefined) =>
        old
          ? {
              ...old,
              ...thing,
            }
          : old,
    )

    if (errors) throw errors
    return (data as Vars).databasesUpdateDocument as { _id: string }
  }
}
