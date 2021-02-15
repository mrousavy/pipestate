import { SetStateAction, useCallback, useEffect } from 'react'
import { useCachedState } from './utils/useCachedState'
import { Atom } from './atom'

export function useAtom<T>(
  atom: Atom<T>
): [state: T, setState: (newState: SetStateAction<T>) => void] {
  const [state, _setState] = useCachedState(atom.current)

  useEffect(() => {
    const unsubscribe = atom.subscribe((t) => _setState(t))
    return () => {
      unsubscribe()
    }
  }, [_setState, atom])
  const setState = useCallback(
    (action: SetStateAction<T>): void => {
      const newState = action instanceof Function ? action(atom.current) : action
      atom.current = newState
    },
    [atom]
  )

  return [state, setState]
}
