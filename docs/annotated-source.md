# Annotated source — server.js

## What this file is

This is an editable copy of `server.js`, taken from commit `6482633` and delivered byte-identical to the source with its original indentation. Edit it freely — it is plain text, and nothing here is generated, locked or read-only. Editing it does not change how this repository runs: the service always executes `server.js` `[server.js:1-14]`, and the block below is text. To run a modified version, copy the block into a file outside this repository and run that.

## The source

All 14 lines of `server.js`, reproduced exactly `[server.js:1-14]`.

```js
const http = require('http');

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello, World Welcome to Sharebot!\n');
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
```

## Line-by-line annotations

`server.js` contains no comments and no JSDoc `[server.js:1-14]`, so this is the only place the code is explained. The rows below cover all 11 code lines, grouped by the four regions the file divides into; lines 2, 5 and 11 are blank and take no row.

### Runtime dependency (line 1)

| Line | What it does |
|---|---|
| 1 | Imports Node's built-in `http` module `[server.js:1]`. This is the only `require` in the file and the only dependency the service has `[server.js:1-14]` — nothing third-party is imported, which is why there is no install step and no build. |

### Configuration constants (lines 3-4)

| Line | What it does |
|---|---|
| 3 | Holds the address the listener binds to, hard-coded in the source `[server.js:3]`, and is consumed by the listener bootstrap at `server.js:12`. See `README.md` for what this value dictates. |
| 4 | Holds the TCP port, hard-coded in the source `[server.js:4]`, and is consumed as the first argument of the listen call at `server.js:12`. The file contains no `process.env` read `[server.js:1-14]`, so neither of these two values can be overridden externally. |

### Request handler (lines 6-10)

| Line | What it does |
|---|---|
| 6 | Creates the server and registers the single request handler as its callback, binding the returned object to `server` for use at `server.js:12`. `req` is declared and never dereferenced anywhere in the file `[server.js:1-14]`, so nothing about the incoming request — method, path, query or body — affects what the handler writes. |
| 7 | Sets the response status on the response object `[server.js:7]`. |
| 8 | Sets the response media type `[server.js:8]`, which is the only header the code sets `[server.js:1-14]`. |
| 9 | Writes the response body and ends the response, with the trailing `\n` part of the string literal `[server.js:9]`. This is the only body write in the file `[server.js:1-14]`. |
| 10 | Closes the handler function and the `http.createServer(...)` call opened at `server.js:6`. The handler contains no conditional and no branch `[server.js:6-10]`, so every dispatched request takes this one path. |

### Listener bootstrap (lines 12-14)

| Line | What it does |
|---|---|
| 12 | Binds the listener and starts accepting connections `[server.js:12]`. It runs during module evaluation, which is why `node server.js` alone starts the service. Note the argument order — port first, then hostname, then the callback — while `hostname` `[server.js:3]` is declared before `port` `[server.js:4]`, so the pairing is easy to misread. |
| 13 | The file's only console write `[server.js:1-14]`. It is a template literal interpolating `hostname` and `port`, so the printed URL derives from the same two constants rather than a separate literal, and it runs once from the listen callback after the bind succeeds. |
| 14 | Closes the callback and the `server.listen(...)` call opened at `server.js:12`. The file registers no `error` listener and no signal handler `[server.js:1-14]`. |

## Running the service

See [`../README.md`](../README.md) for how to run, verify and stop the service.
