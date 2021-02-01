<table>
<tr>
<th><a href="./README.md">README.md</a></th>
<th><a href="./ATOMS.md">ATOMS.md</a></th>
<th><a href="./SELECTORS.md">SELECTORS.md</a></th>
<th>BEST-PRACTICES.md</th>
</tr>
</table>

<br />

# Best Practices

1. **Split** your application's state into as many tiny **atoms** as possible (avoid big state objects)
2. **Keep** your **selectors** as simple and dumb as possible to avoid long running tasks
3. **Avoid** calling a **selector's** or **atom's** setter more often than neccessary
4. **Make** sure you keep an eye on your component's re-renders. (see [welldone-software/**why-did-you-render**](https://github.com/welldone-software/why-did-you-render))
5. **Avoid** calling setters in your component's render function (this may introduce re-render loops!)
6. **Avoid** using an **atom's** `.current` property in **selectors**

<br />
<br />

> **🎉 🥳 Hooray you're done with the docs!**
