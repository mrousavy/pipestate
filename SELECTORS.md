<table>
<tr>
<th><a href="./README.md">README.md</a></th>
<th><a href="./ATOMS.md">ATOMS.md</a></th>
<th>SELECTORS.md</th>
<th><a href="./BEST-PRACTICES.md">BEST-PRACTICES.md</a></th>
</tr>
</table>

<br />

# Selectors

* A **selector** is a derivation from one or many **atoms**
* **Selectors** can also be async
* **Selectors** can also have setters
* **Selectors** can also have parameters

## Creating a selector

get only:

```ts
const CurrentCoordinatesSelector = selector({
  get: ({ get }) => {
    const currentLocation = get(CurrentLocationAtom)
    return currentLocation.coordinates
  },
  dependencies: [CurrentLocationAtom]
})
```

> **⚠️ Note:** Do not forget `dependencies`, otherwise the **selector** won't update if the **atom's** value changes.

get and set:

```ts
const CurrentCoordinatesSelector = selector({
  get: ({ get }) => {
    const currentLocation = get(CurrentLocationAtom)
    return currentLocation.coordinates
  },
  set: async ({ set }, newCoordinates: Coordinates) => {
    const cityName = await lookupCityName(newCoordinates)
    set(CurrentLocationAtom, {
      coordinates: newCoordinates,
      cityName: cityName
    })
  },
  dependencies: [CurrentLocationAtom]
})
```

async get with default value:

```ts
const CurrentCoordinatesSelector = selector({
  default: { latitude: 0, longitude: 0 },
  get: async ({ get }) => {
    const currentLocation = get(CurrentLocationAtom)
    const isValid = await verifyLocation(currentLocation)
    if (!isValid)
      return undefined
    return currentLocation.coordinates
  },
  dependencies: [CurrentLocationAtom]
})
```

with parameters:

```ts
const ChatByIdSelector = selector({
  get: ({ get }, chatId: string) => {
    const chats = get(ChatsAtom)
    return chats.find((c) => c.id === chatId)
  },
  dependencies: [ChatsAtom],
})
```

## Managing selectors

The `useSelector` hook provides access to a **selector** inside of a React component.
Depending on whether the **selector** has a setter, it's return type changes.

get only:

```jsx
export default function App() {
  const [coordinates] = useSelector(CurrentCoordinatesSelector)

  return <Text>Coordinates: {coordinates}.</Text>
}
```

get and set:

```jsx
export default function App() {
  const [coordinates, setCoordinates] = useSelector(CurrentCoordinatesSelector)

  const onGpsLocationChanged = useCallback(async (newLocation) => {
    await setCoordinates(newLocation.coordinates)
  }, [setCoordinates])

  return <Text>Coordinates: {coordinates}</Text>
}
```

with parameters:

```jsx
export default function App() {
  const [chatId, setChatId] = useState('')
  const [chat] = useSelector(ChatByIdSelector, chatId)

  return <Text>Chat: {chat}.</Text>
}
```

## Statically managing selectors

**Selectors** can also be inspected outside of a React component.

```ts
const currentCoordinates = CurrentCoordinatesSelector.get()
```

and if they provide a setter:

```ts
CurrentCoordinatesSelector.set(newCoordinates)
```

<br />
<br />

> **🎉 🥳 Hooray you're ready to learn about [best practices](BEST-PRACTICES.md)!**
