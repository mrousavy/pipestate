import { useCallback, useEffect, useMemo, useState } from 'react'
import { AsyncSelector, Selector, WithSet } from './selector'

function getDefaultSelectorState<T, P extends unknown[]>(
  selector: Selector<T, P> | AsyncSelector<T, P>,
  ...parameters: P
): T {
  const defaultAsyncValue = (selector as AsyncSelector<T, P>)?.default
  if (defaultAsyncValue != null) return defaultAsyncValue
  const defaultSyncValue = selector.get(...parameters)
  if (defaultSyncValue instanceof Promise) {
    throw new Error(
      'Selector<T>.get() returned a Promise<T> while a sync selector was expected! ' +
        "If you're using async getters, please also provide a .default value for the Selector<T>!"
    )
  }
  return defaultSyncValue
}

export function useSelector<T, P extends unknown[]>(
  selector: WithSet<T, P, Selector<T, P>> | WithSet<T, P, AsyncSelector<T, P>>,
  ...parameters: P
): [state: T, setState: (newValue: T) => Promise<void> | void]
export function useSelector<T, P extends unknown[]>(
  selector: Selector<T, P> | AsyncSelector<T, P>,
  ...parameters: P
): [state: T]

/**
 * A hook to subscribe to selector changes. Optionally, this also has a setter.
 * @param selector The selector to subscribe to
 * @param parameters Parameters to pass to the selector. If you're using arrays or objects as parameters, make sure to memoize them using React's `useMemo`.
 */
export function useSelector<T, P extends unknown[]>(
  selector:
    | Selector<T, P>
    | AsyncSelector<T, P>
    | WithSet<T, P, Selector<T, P>>
    | WithSet<T, P, AsyncSelector<T, P>>,
  ...parameters: P
): [state: T] | [state: T, setState: (newValue: T) => Promise<void> | void] {
  const selectorWithSet =
    (selector as WithSet<T, P, Selector<T, P> | AsyncSelector<T, P>>)?.set != null
      ? (selector as WithSet<T, P, Selector<T, P> | AsyncSelector<T, P>>)
      : undefined
  const defaultState = useMemo(() => getDefaultSelectorState(selector, ...parameters), [
    selector,
    parameters,
  ])
  const [state, setState] = useState<T>(defaultState)

  const updateSelectorState = useCallback(async () => {
    const result = selector.get(...parameters)
    if (result instanceof Promise) {
      const t = await result
      setState(t)
    } else {
      setState(result)
    }
    // The dependencies here are a bit tricky, I have to watch out to not forget anything here. I can't just use `parameters` since reference equality isn't maintained on re-renders (because `parameters` is actually of type array, that's how variadic arguments work), so I have to spread 'em.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selector, ...parameters])
  const setSelector = useCallback(
    (newValue: T) => {
      if (selectorWithSet == null) throw new Error('Selector does not have a setter!')
      return selectorWithSet.set(newValue)
    },
    [selectorWithSet]
  )

  useEffect(() => {
    const unsubscribers = selector.dependencies.map((a) => a.subscribe(() => updateSelectorState()))
    return () => {
      unsubscribers.forEach((u) => u())
    }
  }, [selector.dependencies, updateSelectorState])

  if (selectorWithSet == null) return [state]
  else return [state, setSelector]
}
