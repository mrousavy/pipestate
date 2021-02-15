import { renderHook, act } from '@testing-library/react-hooks'
import { selector, useAtom, useSelector } from '../src'
import { atom } from '../src/atom'

test('updating a dependency should update the selector', () => {
  const DEFAULT_USER = {
    username: 'Marc',
  }
  const UserAtom = atom({
    default: DEFAULT_USER,
  })
  const UsernameSelector = selector({
    get: ({ get }) => {
      const user = get(UserAtom)
      return user.username
    },
    dependencies: [UserAtom],
  })

  const { result: atomResult } = renderHook(() => useAtom(UserAtom))
  const { result } = renderHook(() => useSelector(UsernameSelector))

  expect(result.current[0]).toBe(DEFAULT_USER.username)

  act(() => {
    atomResult.current[1]({
      username: 'Chris',
    })
  })

  expect(result.current[0]).toBe('Chris')
})

test("a selector's setter should reflect changes in the selector", () => {
  const DEFAULT_USER = {
    username: 'Marc',
  }
  const UserAtom = atom({
    default: DEFAULT_USER,
  })
  const UsernameSelector = selector({
    set: ({ set }, newUsername: string) => {
      set(UserAtom, { username: newUsername })
    },
    get: ({ get }) => {
      const user = get(UserAtom)
      return user.username
    },
    dependencies: [UserAtom],
  })

  const { result } = renderHook(() => useSelector(UsernameSelector))

  expect(result.current[0]).toBe(DEFAULT_USER.username)

  act(() => {
    result.current[1]('Chris')
  })

  expect(result.current[0]).toBe('Chris')
})

test("a selector's setter should reflect changes in the atom", () => {
  const DEFAULT_USER = {
    username: 'Marc',
  }
  const UserAtom = atom({
    default: DEFAULT_USER,
  })
  const UsernameSelector = selector({
    set: ({ set }, newUsername: string) => {
      set(UserAtom, { username: newUsername })
    },
    get: ({ get }) => {
      const user = get(UserAtom)
      return user.username
    },
    dependencies: [UserAtom],
  })

  const { result: atomResult } = renderHook(() => useSelector(UsernameSelector))
  const { result } = renderHook(() => useSelector(UsernameSelector))

  expect(result.current[0]).toBe(DEFAULT_USER.username)

  act(() => {
    result.current[1]('Chris')
  })

  expect(atomResult.current[0]).toBe('Chris')
})
