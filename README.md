# Intrasonics Assignment

An Intrasonics interview assignment by Willem Garnier.

## Architecture Notes

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
