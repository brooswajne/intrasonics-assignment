# Intrasonics Assignment

An Intrasonics interview assignment by Willem Garnier.

## Architecture Notes

### Type-Checking

For the purpose of developing faster without having to mess with a TypeScript
set-up and having to fix any potential issues with the compilation process, all
files in this project are written in JavaScript.

I still however want type-safety wherever I can, so am using TypeScript's [JSDoc
support](https://www.typescriptlang.org/docs/handbook/jsdoc-supported-types.html)
to type-check the JavaScript files.

### Routing

I'm a big fan of file-based routing, similar to what modern front-end frameworks
such as [SvelteKit](https://kit.svelte.dev/docs#routing) and
[Next.js](https://nextjs.org/docs/routing/introduction) use. In my opinion, it's
an intuitive way to organise your files which inherently forces you to consider
which pieces of functionality and which routes belong together.

As there are only two routes in existence in this example app, it's definitely
overkill for this use-case, but I've still implemented a basic file-based
routing mechanism. Partly for the purpose of future-proofing the app, and partly
because it's fun!

The implementation can be seen in [`./server/routing.js`](./server/routing.js).

A more feature-complete implementation might have additional functionality such
as [error fallbacks](https://kit.svelte.dev/docs#layouts-error-pages), amongst
other things.
