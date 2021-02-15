import { Pipe } from './pipe'

interface AtomProps<T> {
  default: T
}
interface AsyncAtomProps<T> {
  default: T
  initialize: () => Promise<T>
}

export class Atom<T> {
  private _pipe: Pipe<T>
  private _current: T

  public get current(): T {
    return this._current
  }
  public set current(newValue: T) {
    this._current = newValue
    this._pipe.invoke(newValue)
  }

  constructor(props: AtomProps<T> | AsyncAtomProps<T>) {
    this._current = props.default
    this._pipe = new Pipe()
    if ((props as AsyncAtomProps<T>).initialize != null)
      this.initialize((props as AsyncAtomProps<T>).initialize)
  }

  public subscribe(callback: (newValue: T) => void): () => void {
    return this._pipe.subscribe(callback)
  }

  private async initialize(initializer: () => Promise<T>): Promise<void> {
    const result = await initializer()
    this._current = result
  }
}

export function atom<T>(props: AtomProps<T> | AsyncAtomProps<T>): Atom<T> {
  return new Atom(props)
}
