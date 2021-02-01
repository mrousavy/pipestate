<table>
<tr>
<th><a href="./README.md">README.md</a></th>
<th>ATOMS.md</th>
<th><a href="./SELECTORS.md">SELECTORS.md</a></th>
<th><a href="./BEST-PRACTICES.md">BEST-PRACTICES.md</a></th>
</tr>
</table>

<br />

# Atoms

* An **atom** is a simple JavaScript object which represents state in your application.
* **Atoms** use "pipes" to publish changes.
* To use [selectors](SELECTORS.md), you have to create an **atom** first.

## Creating an atom

<p align="right"><a href="https://github.com/mrousavy/pipestate/blob/main/src/atom.ts"><code>atom.ts</code></a></p>

with a default value:

```ts
const MyUserAtom = atom({
  default: {
    name: 'Marc',
    id: 0
  }
})
```

with types and empty defaults:

```ts
const MyUserAtom = atom<User | undefined>({
  default: undefined
})
```

with lazy initialization:

```ts
const MyUserAtom = atom<User | undefined>({
  default: undefined,
  initialize: async () => await loadUser()
})
```

## Managing atoms

<p align="right"><a href="https://github.com/mrousavy/pipestate/blob/main/src/useAtom.ts"><code>useAtom.ts</code></a></p>

The `useAtom` hook provides access to an **atom** inside of a React component. It's syntax is identical to the `useState` syntax.

```tsx
export default function App() {
  const [user, setUser] = useAtom(MyUserAtom)

  return <Text>Welcome, {user.name}.</Text>
}
```

## Statically managing atoms

**Atoms** can also be inspected outside of a React component.

```ts
const currentUser = MyUserAtom.current
```

and they provide a setter:

```ts
const newUser = await login(...)
MyUserAtom.current = newUser
```

You can also subscribe to changes in the **atom**

```ts
MyUserAtom.subscribe((newUser) => {
  console.log(`Welcome ${newUser.name}`)
})
```

<br />
<br />

> **🎉 🥳 Hooray you're ready to learn about [selectors](SELECTORS.md)!**
