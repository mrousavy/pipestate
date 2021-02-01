import { SetStateAction, useCallback, useRef, useState } from 'react'

export function useCachedState<T>(
    initialValue: T,
    comparator?: (oldState: T, newState: T) => boolean
): [state: T, setState: (action: SetStateAction<T>) => void] {
    const [state, setState] = useState(initialValue)
    const cachedState = useRef(initialValue)

    const dispatchState = useCallback(
        (action: SetStateAction<T>) => {
            const newState = action instanceof Function ? action(cachedState.current) : action
            const areEqual =
                comparator == null
                    ? cachedState.current === newState
                    : comparator(cachedState.current, newState)
            if (areEqual) {
                return
            } else {
                cachedState.current = newState
                setState(newState)
            }
        },
        [comparator]
    )

    return [state, dispatchState]
}
