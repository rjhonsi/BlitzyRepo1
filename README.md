# BlitzyRepo1

## Purpose

BlitzyRepo1 is a minimal Node.js HTTP service. It listens on `127.0.0.1:3000` `[server.js:3-4]` and answers every request with a fixed plain-text greeting `[server.js:7-9]`. It is built on the Node.js standard library alone: the only import in the file is the `http` core module `[server.js:1]`, and the file contains no third-party import at all `[server.js:1-14]`. There is no build step and nothing to install, so the source file *is* the deployable artifact — `server.js` is both what you read and what you run.

## Prerequisites

- **A Node.js runtime**, to run the service. This repository declares no supported Node version: there is no `.nvmrc`, no `.node-version`, and no `package.json` and therefore no `engines` field. The documentation here was verified against **Node.js v22.23.2**, which is the version every behaviour described below was observed on — it is a record of what was verified, not a supported range.
- **`curl`, or any HTTP client**, for the verification step in Quick start only. The service itself needs nothing but Node.
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
curl -i http://127.0.0.1:3000/
```

Expect status `200` `[server.js:7]`, the header `Content-Type: text/plain` `[server.js:8]`, and a 34-byte body `[server.js:9]`. The remaining headers are added by the runtime and are not asserted here — `Date` differs on every request — so they are elided below rather than shown as output you should expect to match:

```text
HTTP/1.1 200 OK
Content-Type: text/plain
...
Content-Length: 34

Hello, World Welcome to Sharebot!
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

**The one wire difference is `HEAD`.** A `HEAD` request receives the status and `Content-Type` with no body and no `Content-Length`. The request still reaches the request handler and the handler still writes the body; the runtime suppresses that body on the wire, as HTTP requires. Verified on Node.js v22.23.2. A check that hardcodes a 34-byte body therefore will not hold for `HEAD`, and that is not a defect.

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
