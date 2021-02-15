import { atom } from '../src'

test('atom should reflect changes', () => {
  const CounterAtom = atom({
    default: 0,
  })

  expect(CounterAtom.current).toBe(0)
  CounterAtom.current = 1
  expect(CounterAtom.current).toBe(1)
})

const timeout = (ms: number): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}
test('atom should initialize lazily', async () => {
  const CounterAtom = atom({
    default: 0,
    initialize: async () => {
      await timeout(500)
      return 1
    },
  })

  expect(CounterAtom.current).toBe(0)
  await timeout(500)
  expect(CounterAtom.current).toBe(1)
})

test("atom's subscribe callback should be called for every change", () => {
  const CounterAtom = atom({
    default: 0,
  })

  const callback = jest.fn()
  CounterAtom.subscribe(callback)

  CounterAtom.current = 1
  CounterAtom.current = 2

  expect(callback).toBeCalledTimes(2)
})

test("atom's subscribe callback should only be called if value is different", () => {
  const CounterAtom = atom({
    default: 0,
  })

  const callback = jest.fn()
  CounterAtom.subscribe(callback)

  CounterAtom.current = 1
  CounterAtom.current = 1

  expect(callback).toBeCalledTimes(1)
})
