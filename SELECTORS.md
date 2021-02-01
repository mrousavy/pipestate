<table>
<tr>
<th><a href="./README.md">README.md</a></th>
<th><a href="./ATOMS.md">ATOMS.md</a></th>
<th>SELECTORS.md</th>
</tr>
</table>

<br />

# Selectors

* A **selector** is a derivation from one or many **atoms**
* **Selectors** can also be async

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
