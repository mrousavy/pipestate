import React from 'react'
import TestRenderer from 'react-test-renderer'
import { renderHook, act } from '@testing-library/react-hooks/native'
import { useAtom } from '../src'
import { atom } from '../src/atom'
import { Text, View } from 'react-native'

test('useAtom should render correctly', () => {
  const CounterAtom = atom({
    default: 0,
  })
  function MyComponent(): React.ReactElement {
    const [counter] = useAtom(CounterAtom)
    return (
      <View>
        <Text>{counter}</Text>
      </View>
    )
  }
  const testRenderer = TestRenderer.create(<MyComponent />)
  const testInstance = testRenderer.root

  expect(testInstance.findByType(Text).children).toEqual(0)
})

test('explicit setState should reflect changes', () => {
  const DEFAULT_COUNTER = 0
  const CounterAtom = atom({
    default: DEFAULT_COUNTER,
  })

  const { result } = renderHook(() => useAtom(CounterAtom))

  expect(result.current[0]).toBe(DEFAULT_COUNTER)

  act(() => {
    result.current[1](1)
  })

  expect(result.current[0]).toBe(1)
})

test('function setState should reflect changes', () => {
  const DEFAULT_COUNTER = 0
  const CounterAtom = atom({
    default: DEFAULT_COUNTER,
  })

  const { result } = renderHook(() => useAtom(CounterAtom))

  expect(result.current[0]).toBe(DEFAULT_COUNTER)

  act(() => {
    result.current[1]((curr) => curr + 1)
  })

  expect(result.current[0]).toBe(DEFAULT_COUNTER + 1)
})

test('multiple consumers also reflect changes', () => {
  const DEFAULT_COUNTER = 0
  const CounterAtom = atom({
    default: DEFAULT_COUNTER,
  })

  const { result: result1 } = renderHook(() => useAtom(CounterAtom))
  const { result: result2 } = renderHook(() => useAtom(CounterAtom))
  const { result: result3 } = renderHook(() => useAtom(CounterAtom))

  expect(result1.current[0]).toBe(DEFAULT_COUNTER)
  expect(result2.current[0]).toBe(DEFAULT_COUNTER)
  expect(result3.current[0]).toBe(DEFAULT_COUNTER)

  act(() => {
    result1.current[1]((curr) => curr + 1)
  })

  expect(result1.current[0]).toBe(DEFAULT_COUNTER + 1)
  expect(result2.current[0]).toBe(DEFAULT_COUNTER + 1)
  expect(result3.current[0]).toBe(DEFAULT_COUNTER + 1)
})
