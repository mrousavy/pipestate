export function batchedUpdates(_: () => unknown): void {
  throw new Error(
    'Implementation for `unstable_batchedUpdates` could not be resolved! Are you running in a different Context than react-native or react-dom?'
  )
}
