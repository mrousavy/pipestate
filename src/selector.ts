/* eslint-disable @typescript-eslint/no-explicit-any */
import { Atom } from './atom'

interface SelectorGetAtomCommands {
  get: <T>(atom: Atom<T>) => T
}

interface SelectorSetAtomCommands {
  get: <T>(atom: Atom<T>) => T
  set: <T>(atom: Atom<T>, newValue: T) => void
}

export interface SelectorProps<T, P extends any[]> {
  get: (commands: SelectorGetAtomCommands, ...request: P) => T
}
export interface AsyncSelectorProps<T, P extends any[]> {
  default: T
  get: (commands: SelectorGetAtomCommands, ...request: P) => Promise<T>
}
export type WithSetProps<
  T,
  P extends any[],
  TSelector extends SelectorProps<T, P> | AsyncSelectorProps<T, P>
> = TSelector & {
  set: (commands: SelectorSetAtomCommands, newValue: T) => void | Promise<void>
}

export interface Selector<T, P extends any[]> {
  get: (...request: P) => T
}
export interface AsyncSelector<T, P extends any[]> {
  default: T
  get: (...request: P) => Promise<T>
}
export type WithSet<
  T,
  P extends any[],
  TSelector extends Selector<T, P> | AsyncSelector<T, P>
> = TSelector & {
  set: (newValue: T) => void | Promise<void>
}

export function selector<T, P extends any[]>(
  props: WithSetProps<T, P, AsyncSelectorProps<T, P>>
): WithSet<T, P, AsyncSelector<T, P>>
export function selector<T, P extends any[]>(
  props: WithSetProps<T, P, SelectorProps<T, P>>
): WithSet<T, P, Selector<T, P>>
export function selector<T, P extends any[]>(props: AsyncSelectorProps<T, P>): AsyncSelector<T, P>
export function selector<T, P extends any[]>(props: SelectorProps<T, P>): Selector<T, P>

export function selector<T, P extends any[]>(
  props:
    | SelectorProps<T, P>
    | AsyncSelectorProps<T, P>
    | WithSetProps<T, P, SelectorProps<T, P>>
    | WithSetProps<T, P, AsyncSelectorProps<T, P>>
):
  | Selector<T, P>
  | AsyncSelector<T, P>
  | WithSet<T, P, Selector<T, P>>
  | WithSet<T, P, AsyncSelector<T, P>> {
  const get = <AT>(atom: Atom<AT>): AT => {
    return atom.current
  }
  const set = <AT>(atom: Atom<AT>, newValue: AT): void => {
    atom.current = newValue
  }

  const setProps =
    (props as WithSetProps<T, P, typeof props>).set != null
      ? (props as WithSetProps<T, P, typeof props>)
      : undefined
  const asyncProps =
    (props as AsyncSelectorProps<T, P>).default != null
      ? (props as AsyncSelectorProps<T, P>)
      : undefined
  if (setProps != null) {
    // it's a get-set selector
    if (asyncProps != null) {
      return {
        default: asyncProps.default,
        get: (...p) => asyncProps.get({ get }, ...p),
        set: (v) => setProps.set({ get, set }, v),
      } as WithSet<T, P, AsyncSelector<T, P>>
    } else {
      return {
        get: (...p) => props.get({ get }, ...p),
        set: (v) => setProps.set({ get, set }, v),
      } as WithSet<T, P, Selector<T, P>>
    }
  } else {
    // it's a get selector
    if (asyncProps != null) {
      return {
        default: asyncProps.default,
        get: (...p) => asyncProps.get({ get }, ...p),
      } as AsyncSelector<T, P>
    } else {
      return {
        get: (...p) => props.get({ get }, ...p),
      } as Selector<T, P>
    }
  }
}
