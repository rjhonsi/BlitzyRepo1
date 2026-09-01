# BlitzyRepo1

## Purpose

BlitzyRepo1 is a minimal Node.js HTTP service. It listens on `127.0.0.1:3000` `[server.js:3-4]`, and its single request handler writes the same fixed plain-text greeting for every request dispatched to it `[server.js:7-9]` — what a caller observes on the wire, including the one case where it differs, is set out under **What it responds** below. It is built on the Node.js standard library alone: the only import in the file is the `http` core module `[server.js:1]`, and the file contains no third-party import at all `[server.js:1-14]`. There is no build step and nothing to install, so the source file *is* the deployable artifact — `server.js` is both what you read and what you run.

## Prerequisites

- **A Node.js runtime**, to run the service. This repository declares no supported Node version: there is no `.nvmrc`, no `.node-version`, and no `package.json` and therefore no `engines` field. The documentation here was verified against **Node.js v22.23.2**, which is the version every behaviour described below was observed on — it is a record of what was verified, not a supported range.
- **`curl`, or any HTTP client**, for the verification step in Quick start and the worked examples below. The service itself needs nothing but Node.
- **No install step**, because there are no third-party dependencies `[server.js:1]`. Clone the repository and run it.

## Quick start

Start the service from the repository root:

```bash
node server.js
```

The listener bootstrap binds during module evaluation `[server.js:12]` and prints exactly one line `[server.js:13]`:

```text
Server running at http://127.0.0.1:3000/
```

That line confirms the bind succeeded. Verify the service is serving, from the same host:

```bash
curl -i --noproxy '*' http://127.0.0.1:3000/
```

Expect status `200` `[server.js:7]`, the header `Content-Type: text/plain` `[server.js:8]`, and a 34-byte body `[server.js:9]`. The remaining headers are added by the runtime and are not asserted here — `Date` differs on every request — so they are elided below rather than shown as output you should expect to match:

```text
HTTP/1.1 200 OK
Content-Type: text/plain
...

Hello, World Welcome to Sharebot!
```

**Assert the body length.** The greeting is 33 characters and the string literal it is written in ends with a newline `[server.js:9]`, so an ordinary request transfers exactly 34 bytes. `curl` reports that count itself:

```bash
curl -s --noproxy '*' -o /dev/null -w '%{size_download}\n' http://127.0.0.1:3000/
```

```text
34
```

Stop the service with **Ctrl+C** in the terminal running it. Termination is abrupt: the file registers no `SIGINT` or `SIGTERM` handler `[server.js:1-14]`, so the process ends immediately and in-flight requests are not drained. This is the current behaviour of the service as committed.

## What it responds

The response contract is this service's only consumer-facing interface. It is described at two levels, because what the application writes and what a caller observes on the wire are not identical.

**What the application writes**, for every request the runtime dispatches to the request handler — `HEAD` included:

| Field | Value | Source |
|---|---|---|
| Status | `200` | `server.js:7` |
| `Content-Type` | `text/plain` | `server.js:8` |
| Body | `Hello, World Welcome to Sharebot!` plus a trailing newline — 34 bytes | `server.js:9` |

The request handler accepts `req` and never dereferences it `[server.js:6]`; the file dereferences it nowhere `[server.js:1-14]`. Nothing about the request — method, path, query string or body — changes what the application writes, and there is no routing of any kind. One consequence is worth drawing out, because a reader will otherwise get it wrong: **`/health` is not a health endpoint.** It returns `200` for the same reason every other path does, and concluding from that response that a health check exists would be a mistake.

Any ordinary method, against any path, with any query string, demonstrates that — here `POST /any/path?q=1`:

```bash
curl -s --noproxy '*' -o /dev/null -w '%{http_code} %{content_type} %{size_download}\n' -X POST 'http://127.0.0.1:3000/any/path?q=1'
```

```text
200 text/plain 34
```

`DELETE`, `OPTIONS`, `PUT` and `PATCH` against that same URL each print the identical line: the runtime dispatches every one of them to the one handler `[server.js:6-10]`, which reads nothing from the request. Verified on Node.js v22.23.2.

**The one wire difference is `HEAD`.** A `HEAD` request receives the status and `Content-Type` with no body and no `Content-Length`. The request still reaches the request handler and the handler still writes the body; the runtime suppresses that body on the wire, as HTTP requires. Verified on Node.js v22.23.2. A check that hardcodes a 34-byte body therefore will not hold for `HEAD`, and that is not a defect. Both halves of that are observable — the status arrives, and the transferred body is zero bytes:

```bash
curl -s --noproxy '*' -I -o /dev/null -w '%{http_code} %{size_download}\n' http://127.0.0.1:3000/
```

```text
200 0
```

The headers themselves, with the runtime's own elided:

```bash
curl -s --noproxy '*' -I http://127.0.0.1:3000/
```

```text
HTTP/1.1 200 OK
Content-Type: text/plain
...
```

What the `...` stands for is the headers the runtime adds, `Date` among them. It conceals no `Content-Length`: there is no `Content-Length:` line anywhere in that output for a `HEAD` request. Verified on Node.js v22.23.2.

**Header provenance.** `Content-Type` is the only header the code sets `[server.js:8]`, and it is the only `setHeader` call in the file `[server.js:1-14]`. `Date`, the connection headers and `Content-Length` are supplied by the runtime, not by `server.js`.

**No exported API.** The module exports nothing usable: the file contains no `module.exports`, no `exports.` assignment, no named function declaration and no class declaration `[server.js:1-14]`. Requiring it from another module starts the listener and yields nothing to call, so the contract above *is* the interface — there is no importable API to document.

## Configuration

The two values that govern reachability are configuration constants: module-level bindings hard-coded in the source and evaluated when the module loads. Neither can be overridden at run time.

| Value | Location | Setting | Runtime override |
|---|---|---|---|
| `hostname` | `server.js:3` | `127.0.0.1` | None |
| `port` | `server.js:4` | `3000` | None |

The file performs zero `process.env` reads `[server.js:1-14]`, and the repository has no configuration file, no `.env` and no command-line argument parsing. Setting `PORT` or `HOST` in the environment therefore changes nothing; both were verified to be ignored on Node.js v22.23.2.

The consequence is the most significant and least visible fact about this service. The listener performs a loopback bind `[server.js:3]`: callers on the same host reach it at `127.0.0.1:3000`, and callers on any other host do not — a request sent to this machine's routable address is refused rather than answered. Verified on Node.js v22.23.2.

**Demonstrating `hostname`.** With the service running, send the same request to any address of this machine other than `127.0.0.1` — written here as `<host-address>`, because the value is specific to your machine:

```bash
curl -sS --noproxy '*' -m 3 -o /dev/null 'http://<host-address>:3000/'; echo "exit=$?"
```

```text
curl: (7) Failed to connect to <host-address> port 3000 ...
exit=7
```

Nothing answers: no HTTP status comes back at all, and `curl` exits `7`, its connection-failure status. The tail of that message is elided because it carries a timing that differs on every attempt. The same running instance still answers on loopback, and that control is what makes this a refusal by the bind address `[server.js:3]` rather than a service that is not up:

```bash
curl -s --noproxy '*' -o /dev/null -w '%{http_code}\n' http://127.0.0.1:3000/
```

```text
200
```

**Demonstrating `port`.** With that first instance still holding `127.0.0.1:3000`, start a second one in another terminal:

```bash
node server.js; echo "exit=$?"
```

```text
...
Error: listen EADDRINUSE: address already in use 127.0.0.1:3000
...
exit=1
```

The startup line never prints, the second process exits `1`, and the first instance carries on serving: the port `[server.js:4]` admits exactly one listener at a time. The elided lines are the runtime's own stack frames and version banner, which vary by host and are not part of what to expect. Verified on Node.js v22.23.2. Troubleshooting covers this symptom and what to do about it.

To run the service on a different address or port, take the editable copy in `docs/annotated-source.md` (linked under Documentation), change the two constants in your copy, and run it as a file outside this repository. Editing that copy does not affect this repository, whose two values stay exactly as committed.

## Troubleshooting

| Symptom | Cause and resolution |
|---|---|
| Startup fails reporting that the address is already in use | Another process already holds `127.0.0.1:3000`. There is no fallback port, and the file registers no `server.on('error')` handler `[server.js:1-14]`, so the process reports the error and exits. Stop whatever holds the port, or take the copy in `docs/annotated-source.md`, change `port` in it, and run that outside this repository. |
| The `node` command is not found | No Node.js runtime is on your `PATH`. Install one and run the command again; the version this documentation was verified against is named under Prerequisites. |
| A request from another machine is refused | Expected, not a fault: the listener performs a loopback bind. See Configuration. |
| `npm start` or `npm install` fails reporting that there is no `package.json` | Correct — this repository carries no manifest, so neither command has an entry point, and nothing needs installing: `node server.js` is the entire startup path. Do not run `npm install` here; it leaves a `package-lock.json` in the working tree, a file this repository does not carry. |

## Documentation

- [docs/annotated-source.md](docs/annotated-source.md) — an editable, byte-identical copy of `server.js`, annotated line by line across all 11 code lines.

## Licence

Licensed under the Apache License, Version 2.0. The full terms are in the `LICENSE` file at the repository root `[LICENSE:1-3]`. That file's copyright notice is an unfilled placeholder `[LICENSE:189]`, so no copyright holder and no year are asserted here.
