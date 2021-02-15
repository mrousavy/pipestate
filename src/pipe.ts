import { unstable_batchedUpdates } from 'react-native'

type Callback<T> = (newValue: T) => void

export class Pipe<T> {
  private _subscribers: Callback<T>[] = []

  /**
   * Subscribes to changes in this Pipe.
   * @param callback The callback to invoke when there is a new value piped. This function also gets invoked immediately after subscribing
   * @returns An unsubscriber function
   */
  public subscribe(callback: Callback<T>): () => void {
    this._subscribers.push(callback)
    return () => this.unsubscribe(callback)
  }

  private unsubscribe(callback: Callback<T>): void {
    const index = this._subscribers.indexOf(callback)
    if (index === -1) throw new Error('The given callback is not subscribed to this Pipe!')
    this._subscribers.splice(index, 1)
  }

  /**
   * Clear all subscribers in this Pipe.
   */
  public clear(): void {
    for (let i = 0; i < this._subscribers.length; i++) this._subscribers.splice(i, 1)
  }

  /**
   * Invoke a new change in the pipe.
   * @param newValue The new value to pass to the callbacks.
   */
  public invoke(newValue: T): void {
    // invoke latest subscriber immediately
    this._subscribers[this._subscribers.length - 1]?.(newValue)
    // invoke older subscribers in reversed loop because of first in first out principle
    unstable_batchedUpdates(() => {
      for (let i = this._subscribers.length - 2; i >= 0; i--) this._subscribers[i]?.(newValue)
    })
  }
}
