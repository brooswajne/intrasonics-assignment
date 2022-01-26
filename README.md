# Intrasonics Assignment

An Intrasonics interview assignment by Willem Garnier.

## Usage

The application entry point is [`server.js`](./server.js), which can simply be
run using `node` (version 16.x is required):

```console
$ node server.js
13:00:43 INF Starting application...
```

Alternatively, an `npm run start` script is available.

The application's behaviour can be configured using environment variables. These
are defined in [`server/config.js`](./server/config.js).  \
Note that for a proper production-ready application we might want to move this
configuration to a dedicated configuration file, this is just a temporary and
easy mechanism for the purpose of this assignment.

Once the server is started, the API can be used by making HTTP requests to
whatever port you have configured (3000 by default):

```console
$ curl http://localhost:3000/actions -v
*   Trying ::1...
* TCP_NODELAY set
* Connected to localhost (::1) port 3000 (#0)
> GET /actions HTTP/1.1
> Host: localhost:3000
> User-Agent: curl/7.64.1
> Accept: */*
>
< HTTP/1.1 200 OK
< X-Powered-By: Express
< Content-Type: application/json; charset=utf-8
< Content-Length: 145
< ETag: W/"91-YNCmsTTsMaDswMvKCtL/9gckanY"
< Date: Wed, 26 Jan 2022 13:11:20 GMT
< Connection: keep-alive
< Keep-Alive: timeout=5
<
* Connection #0 to host localhost left intact
[{"codeword":31415,"actionId":"hay"},{"codeword":27182,"actionId":"hay"},{"codeword":42,"actionId":"needle"},{"codeword":16180,"actionId":"hay"}]
```

## Developing

An `npm run watch` script is available which will start the application and
automatically restart it whenever you update any code.

Ensure code passes both linting and type-checks by using the `npm run lint` and
`npm run check` scripts respectively.

The full test suite can be run at any time using `npm run test`, and it is also
broken down by test type with scripts `npm run test:unit` and `npm run
test:api`.  \
**IMPORTANT**: the API tests will clear and write data to whichever database if
configured when they are run. You should specify a different database (using the
`IA_DB_NAME` environment variable) if you want to avoid overwriting existing
data.

## Architecture Notes

### Data Model

To slightly clarify the meaning of the data stored in `actions.json` in my mind,
I chose to call that "database"'s entries `ActionMapping`s, and to rename the
`id` field to `actionId`.  \
Not great naming, but it slightly clarifies that the entries are not actions
themselves, but rather that they represent a mapping of codewords to the actions
they should trigger (identified by the action's id).

### Language

I chose to build this application in JavaScript just due to being most familiar
with the language, and therefore feeling I'd be most productive within the
time-frame.

If this were a real production service, I'd love to build it in a language like
Go (or even better, Rust!), especially if I expect this API to be
mission-critical and therefore needing both fast response times as well as
excellent type-safety (to avoid runtime crashes).

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
