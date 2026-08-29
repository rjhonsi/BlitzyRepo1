# User Stories and Acceptance Criteria

This document is an as-built agile requirements artifact for this repository: five epics, seventeen user stories in canonical form, and each story's acceptance criteria as a bulleted list of pass/fail conditions. It describes the requirement set at baseline commit `6482633` and nothing else — every criterion is a condition traceable to committed code, committed text, or a requirement already published for this repository, and no capability is invented. It derives from the three committed files, `server.js`, `LICENSE` and `README.md`, structured against the Technical Specification for this repository, which supplies the feature identifiers in §2.1, the requirement identifiers in §2.2, the verification statuses in §2.5.1, and the assumption and constraint identifiers in §2.5.4 and §2.5.5. A commit is named because the repository carries no tag and no version field, so a commit is the only citable state (C-12); the request that prompted the document was:

> Can you create a detailed user stories for the uploaded project. Please list all the acceptance criteria in bulletted points

## Conventions

- **Story shape.** Each story is one sentence: *As a `<persona>`, I want `<capability>`, so that `<benefit>`.* The persona is one of the four labels below, written verbatim.
- **Acceptance criteria are bullets.** Each bullet is exactly one condition a reader can judge pass or fail, stated in the present tense as a condition of *satisfaction*.
- **Criteria versus notes.** A criterion is drawn from the published acceptance checks for a requirement the story covers, or from a source fact those checks rest on; a negative qualifies where the absence is itself the contract. Everything else is a **note**, and notes are **non-normative** — they record runtime, host or client behaviour, incidental absences nobody required, and the evidence behind a status. A note is never a condition this repository must keep satisfying.
- **Priority vocabulary.** `Must-Have` and `Should-Have`, inherited from the requirement each story covers. Epics carry the feature priority: Critical, High, or Medium.
- **Baseline status vocabulary.** `Verified`, `Verified minimally`, `Not satisfied`. Baseline status is **inherited** from the Technical Specification's traceability matrix in §2.5.1 for the requirement the story covers — the least satisfied where it covers more than one. It is **not** re-derived from whether the story's own criteria pass, so a story whose criterion passes can still carry `Verified minimally` where the assessment records how thinly the requirement is met.
- **Verification vocabulary.** Source inspection, shell probe, repository-wide search, captured stdout, browser check.
- **Locators.** Every criterion or note asserting a fact about the codebase carries its locator immediately after the claim, as `[path:locator]`.
- **`(repository-wide search)`** is the evidence form for an absence that no single file can evidence. It is a sanctioned citation, not a missing one: it asserts that a search of every tracked file at the baseline commit found no instance. A claim about one file always carries a path locator instead.
- **Verification is manual.** The repository contains no test runner, linter, or pipeline (C-07), so every criterion is written as an observable a reader can confirm by inspecting a file, running a shell probe, or opening a browser. No criterion presupposes automation.
- **INVEST.** Applied as Valuable, Small and Testable, plus independent documentation and verification — each story can be read and checked on its own. *Negotiable* and *Estimable* have limited applicability to as-built documentation of an implementation already fixed in code, and no story points, sprints or estimates are given.

Three things are stated here once, so the stories refer back rather than restate them.

- **Request-handler scope.** Response criteria describe the application's own request-handler path — what the inline handler does for requests delivered through the server's `request` event. Protocol-layer cases such as `CONNECT`, malformed requests and `HEAD` are recorded as notes on the stories they affect. That boundary is the boundary of the code under documentation, not a limitation of the platform: Node routes `CONNECT` to a separate `connect` event and reports parser failures to a `clientError` event, and both are listenable — this source registers neither `[server.js:1-14]`, which is why those cases fall to Node's defaults.
- **The normalising comparison.** Where a criterion requires the licence text to be unmodified, it is tested by comparison against the canonical published text after normalising leading and trailing blank lines and trailing whitespace. Published copies differ in exactly that respect while the substantive text is identical, so a raw byte comparison could fail on whitespace alone.
- **Shared runtime preconditions.** Every runtime criterion presumes a compatible Node.js runtime on the host and TCP port 3000 free on the loopback interface. No story repeats these.

## Personas

These four personas are **documentation constructs**. The application identifies no caller and defines no roles, so no persona corresponds to an account, a credential, or a permission in the running system.

- **developer or maintainer** (`P-01`) — the developer who executes the file, one of the two actors §1.3.1.2 names.
- **local HTTP client consumer** (`P-02`) — the same-host HTTP client, the other actor §1.3.1.2 names.
- **operator or process supervisor** (`P-03`) — derived from assumption A-04, that something external supervises the process.
- **downstream consumer or redistributor** (`P-04`) — derived from feature `F-005` and the Apache-2.0 reuse obligations.

## Epic index

| Epic | Feature | Epic priority | Stories |
|---|---|---|---|
| E-01 HTTP Endpoint Provisioning | F-001 | Critical | US-001 – US-005 |
| E-02 Uniform Static Plain-Text Response | F-002 | Critical | US-006 – US-010 |
| E-03 Startup Readiness Notification | F-003 | Medium | US-011 |
| E-04 Zero-Dependency Standard-Library Execution Model | F-004 | High | US-012 – US-014 |
| E-05 Repository Baseline and Licensing Artifacts | F-005 | Medium | US-015 – US-017 |

Per §2.1.4.3, `F-004` is the dependency root, `F-001` depends on `F-004`, and `F-002` and `F-003` depend on `F-001`; that is a fact about the system rather than an ordering instruction, and this document does not reorder itself around it. Per-story status is carried on each story, because `E-05` mixes three statuses and any roll-up value would either hide that or need a rule the specification does not supply.

## E-01 — HTTP Endpoint Provisioning

Feature `F-001` · epic priority Critical · stories US-001 to US-005.

### US-001 — Start the service with one command

*As a developer or maintainer, I want to start the service with one command, so that I have a running HTTP endpoint.*

**Primary persona** developer or maintainer (`P-01`) · **Covers** `F-001-RQ-001` · **Priority** Must-Have · **Baseline status** Verified · **Verification** source inspection, shell probe

**Acceptance criteria**

- `node server.js`, run from the repository root with the shared preconditions met, starts the process without error and leaves it listening in the foreground until terminated `[server.js:12]`.
- The server object is created through the Node core `http` module and `http.createServer`, and no other server-creation call exists in the source `[server.js:1,6]`.
- The application defines no inputs of its own: it declares no command-line arguments and reads no environment variable or configuration file `[server.js:1-14]`.

**Notes** — Node itself consumes the script path and may consume its own variables such as `NODE_OPTIONS`; the criterion concerns inputs the application defines. Zero-install startup is US-012.

### US-002 — Reach the service at a fixed, known local endpoint

*As a local HTTP client consumer, I want the service to listen on a fixed, documented endpoint, so that I know where to send requests without reading source.*

**Primary persona** local HTTP client consumer (`P-02`) · **Also serves** `P-01` · **Covers** `F-001-RQ-002` · **Priority** Must-Have · **Baseline status** Verified · **Verification** source inspection, shell probe

**Acceptance criteria**

- The listener binds hostname `127.0.0.1` and TCP port `3000` `[server.js:3-4,12]`.
- An ordinary request to `http://127.0.0.1:3000/` returns `HTTP/1.1 200 OK` `[server.js:6-9]`.
- The endpoint is the same on every run, the source providing no mechanism to vary it `[server.js:3-4]`.

**Notes** — `http://localhost:3000/` also answers wherever the host resolves `localhost` to `127.0.0.1`, as it did in the verification environment; a host resolving it to an IPv6 loopback address would refuse. That is a host property.

### US-003 — Have an ordinary request dispatched and answered

*As a local HTTP client consumer, I want an ordinary HTTP request — one delivered to the request handler — dispatched and answered, so that I receive a response on the same connection.*

**Primary persona** local HTTP client consumer (`P-02`) · **Covers** `F-001-RQ-003` · **Priority** Must-Have · **Baseline status** Verified · **Verification** source inspection, shell probe

**Acceptance criteria**

- The source registers exactly one request handler, inline on `http.createServer`, and every request delivered through the server's `request` event invokes it `[server.js:6]`.
- Such a request receives an `HTTP/1.1` response with status `200` on the same connection `[server.js:7-9]`.

**Notes** — `CONNECT` is not delivered through the `request` event. Node routes it to a separate `connect` event, and this source registers no listener for it `[server.js:1-14]`, so a valid `CONNECT` receives no response and the socket closes. Connection-management headers are Node-supplied and follow the request's own `Connection` value. The source configures no timeout, backlog, or connection limit.

### US-004 — Know that the listener is confined to the loopback interface

*As an operator or process supervisor, I want to know which interface the listener attaches to, so that I can judge where this service may safely run.*

**Primary persona** operator or process supervisor (`P-03`) · **Also serves** `P-01` · **Covers** `F-001-RQ-002` · **Priority** Must-Have · **Baseline status** Verified · **Verification** source inspection

**Acceptance criteria**

- The bind address passed to `server.listen` is the constant `127.0.0.1`, attaching the listener to the loopback interface only `[server.js:3,12]`.
- The source contains nothing that broadens the bind — no wildcard address, and no address taken from the environment or the command line `[server.js:1-14]`.

**Notes** — in the verification environment a request to the host's non-loopback address on port 3000 did not connect. Repository inspection cannot establish what else may answer that address; host firewall and network policy lie outside it, and the source contains no TLS, allow-list, or authorization code. Constraint C-02 records the effect and assumption A-03 the co-location it implies; whether the confinement is intentional is an open question, which is why this story reports interface attachment rather than intent.

### US-005 — Change the endpoint by editing one file

*As a developer or maintainer, I want the endpoint defined by in-source constants in a single file, so that changing it is unambiguous and cannot leave the startup message stale.*

**Primary persona** developer or maintainer (`P-01`) · **Covers** `F-001-RQ-004` · **Priority** Must-Have · **Baseline status** Verified · **Verification** source inspection, repository-wide search

**Acceptance criteria**

- `hostname` and `port` are declared as module-level constants, once each, in `server.js` `[server.js:3-4]`.
- Those two constants are the only values passed to `server.listen` `[server.js:12]`.
- The source reads no environment variable and no command-line argument `[server.js:1-14]`.
- No configuration source exists elsewhere in the repository — no `.env`, no `.env.example`, no `config/` path (repository-wide search).
- The startup message interpolates the same two constants, so the reported URL cannot diverge from the bind `[server.js:13]`.

**Notes** — constraints C-01 and C-06 record the consequences — the endpoint is immutable without a source edit, and no configuration can vary application behavior. C-06 holds for application configuration: nothing an operator sets changes what the application does, while observable behavior still varies with runtime version, port availability, name resolution, request framing and client behavior, which is why those live in notes.


## E-02 — Uniform Static Plain-Text Response

Feature `F-002` · epic priority Critical · stories US-006 to US-010.

### US-006 — Receive a success status from the application

*As a local HTTP client consumer, I want every request the application handles answered with `200`, so that a reply confirms the service is alive without further interpretation.*

**Primary persona** local HTTP client consumer (`P-02`) · **Covers** `F-002-RQ-001` · **Priority** Must-Have · **Baseline status** Verified · **Verification** source inspection, shell probe

**Acceptance criteria**

- The handler sets the response status to `200` `[server.js:7]`.
- No other status assignment, and no error, redirect, or not-found path, exists in the source, so `200` is the only status the application produces `[server.js:1-14]`.
- Every ordinary request receives `200`, whatever its method, path, or query `[server.js:6-9]`.

**Notes** — statuses can originate below the application. Node's parser answers malformed traffic before the handler runs — `400` for an invalid method token or a missing `Host` header on HTTP/1.1, `431` for an oversized header — and `CONNECT` receives no application response, per US-003. The source registers no `clientError` listener, so those parser responses are Node's defaults `[server.js:1-14]`. Constraint C-03 concerns the application's own representable responses, read at the request-handler scope this document's conventions note defines.

### US-007 — Receive a response labelled as plain text

*As a local HTTP client consumer, I want the response typed as plain text, so that my client renders it literally rather than attempting to parse markup.*

**Primary persona** local HTTP client consumer (`P-02`) · **Covers** `F-002-RQ-002` · **Priority** Must-Have · **Baseline status** Verified · **Verification** source inspection, shell probe

**Acceptance criteria**

- The handler sets `Content-Type: text/plain` `[server.js:8]`.
- It is the only header the application sets `[server.js:1-14]`.

**Notes** — `Content-Length`, `Date`, `Connection` and `Keep-Alive` are generated by Node. The observed header carries no `charset` parameter, and no `Server`, `X-Powered-By`, `Cache-Control`, `ETag`, or security header appears — properties of the current implementation and runtime, not requirements that they stay absent.

### US-008 — Receive the exact greeting body on a body-bearing request

*As a local HTTP client consumer, I want a known, byte-exact body on a request that carries one, so that I can confirm I reached this service and not another process on the same port.*

**Primary persona** local HTTP client consumer (`P-02`) · **Also serves** `P-01` · **Covers** `F-002-RQ-003` · **Priority** Must-Have · **Baseline status** Verified · **Verification** source inspection, shell probe

**Acceptance criteria**

- The handler ends the response with a single compile-time string literal, no template, data source, or serializer participating in producing it `[server.js:9]`.
- On a body-bearing request such as `GET`, that body is exactly `Hello, World Welcome to Sharebot!` followed by a single LF — 34 bytes of US-ASCII, no carriage return, no byte-order mark `[server.js:9]`.
- Its punctuation is exact: one comma after `Hello`, none between `World` and `Welcome`, single spaces throughout, an exclamation mark after `Sharebot` `[server.js:9]`.

**Notes** — Node derives `Content-Length: 34` from that literal for `GET`, and suppresses both body and `Content-Length` for `HEAD`, the application code being identical either way — which is why the body criterion is scoped to a body-bearing request. Assumption A-07 records that a single hardcoded English response is presumed acceptable to every caller.

### US-009 — Get the same answer however I form an ordinary request

*As a local HTTP client consumer, I want the application's answer invariant across the request dimensions I control, so that no client configuration or negotiation is needed.*

**Primary persona** local HTTP client consumer (`P-02`) · **Covers** `F-002-RQ-004` · **Priority** Must-Have · **Baseline status** Verified · **Verification** source inspection, shell probe

**Acceptance criteria**

- The handler never dereferences `req`, and the source contains no reference to a request URL, method, header, or body, so no request attribute can alter what the application produces `[server.js:6,1-14]`.
- Every ordinary request receives the same status, `Content-Type`, and application body, whatever its method among `GET`, `POST`, `PUT`, `DELETE`, `PATCH` and `OPTIONS` `[server.js:7-9]`.
- The requested path and query are neither acted on nor echoed in the response `[server.js:6-9]`.
- A request body is accepted and never read, so sending one changes nothing `[server.js:6]`.
- `DELETE /admin` without credentials receives `200`, which is the same statement as the absence of access control `[server.js:1-14]`.

**Notes** — invariance is asserted over the application's output. The `Date` header varies; connection headers follow the request, per US-003; `HEAD` bodies and lengths are suppressed, per US-008; malformed requests are answered by the parser and `CONNECT` gets no application response, per US-006 and US-003; an `Expect: 100-continue` request is handled by Node's default continue behavior rather than by application code. Assumption A-06 records that callers are presumed to need no differentiation.

### US-010 — Confirm the service from a browser

*As a developer or maintainer, I want to open the endpoint in a browser and see the greeting, so that I can confirm the service without a command-line client.*

**Primary persona** developer or maintainer (`P-01`) · **Covers** `F-002-RQ-002`, `F-002-RQ-003` · **Priority** Must-Have · **Baseline status** Verified · **Verification** source inspection, browser check

**Acceptance criteria**

- The application emits no markup, document structure, or static asset, so nothing it sends requires a browser to construct a document `[server.js:1-14]`.
- The response it does send — `Content-Type: text/plain` with a text body — is one a conforming browser displays as literal text rather than parsing as markup `[server.js:8-9]`.

**Notes** — observed in a headless Chrome 151 session and recorded as observation, not obligation — an arbitrary path with a query rendered identically with the URL retained and no redirect; the console logged no message of any severity; and the browser's automatic `/favicon.ico` request was answered `200` with the same plain-text body and silently discarded, so no icon appeared. Another browser or version may present these differently. §7.1 of the Technical Specification determines that this response surface is not a user interface; the story documents a browser used as an ad-hoc HTTP client.


## E-03 — Startup Readiness Notification

Feature `F-003` · epic priority Medium · story US-011.

### US-011 — Know from the console that the service is ready and where

*As an operator or process supervisor, I want one console line confirming readiness and reporting the effective URL, so that I know the bind succeeded and where to reach it.*

**Primary persona** operator or process supervisor (`P-03`) · **Covers** `F-003-RQ-001`, `F-003-RQ-002` · **Priority** Should-Have · **Baseline status** Verified · **Verification** source inspection, captured stdout

**Acceptance criteria**

- The source writes exactly one line to stdout: `Server running at http://127.0.0.1:3000/` `[server.js:13]`.
- That line is emitted from inside the `server.listen` callback, so it appears only once the listener is ready `[server.js:12-13]`.
- Its URL is interpolated from the same constants used for the bind `[server.js:3-4,13]`.
- The handler performs no logging, so stdout is unchanged after requests are served `[server.js:6-10]`.
- The source registers no listener for the server's `error` event, so a bind failure is unhandled and no readiness line is printed `[server.js:1-14]`.

**Notes** — with port 3000 occupied the process emitted an unhandled error event and exited non-zero — assumption A-02 and constraints C-04 and C-08. C-04 holds for an unmodified process in the same network namespace, since the endpoint is a fixed constant with no fallback `[server.js:3-4]`; a separate namespace or container is not excluded by anything in the repository. That single line is the entire telemetry surface: no structured logger, log destination, health endpoint, or metric exists, and §1.2.3.3 of the Technical Specification records that no KPI is instrumented.

## E-04 — Zero-Dependency Standard-Library Execution Model

Feature `F-004` · epic priority High · stories US-012 to US-014.

### US-012 — Run the service from a fresh clone with no project install

*As a developer or maintainer, I want a fresh clone to run once a Node runtime is present, so that no project or package installation stands between cloning and running.*

**Primary persona** developer or maintainer (`P-01`) · **Covers** `F-004-RQ-002` · **Priority** Must-Have · **Baseline status** Verified · **Verification** repository-wide search, shell probe

**Acceptance criteria**

- The service starts and serves with no package installation and no lock-file reconciliation, given the shared preconditions `[server.js:1]`.
- No `node_modules` directory exists in the repository, and none is required (repository-wide search).
- No dependency manifest or lock file exists — `package.json`, `package-lock.json`, `yarn.lock` and `pnpm-lock.yaml` are each absent (repository-wide search).
- The repository declares no package metadata: no name, version, description, or start script (repository-wide search).

**Notes** — the Node.js runtime itself is a prerequisite, not a project install. Assumption A-05 states the run command is documented nowhere in the repository; this artifact publishes it in US-001, so A-05 is superseded in that respect, while `README.md` itself still carries no run instructions `[README.md:1]`.

### US-013 — Depend on no third-party package

*As a downstream consumer or redistributor, I want the service to import nothing outside the Node standard library, so that adopting it adds no third-party package to my dependency graph.*

**Primary persona** downstream consumer or redistributor (`P-04`) · **Covers** `F-004-RQ-001` · **Priority** Must-Have · **Baseline status** Verified · **Verification** source inspection, repository-wide search

**Acceptance criteria**

- The source loads exactly one module — the Node core `http` module, via a single `require` — and contains no `import` statement and no dynamic import `[server.js:1,1-14]`.
- No lock file and no vendored library exist in the repository (repository-wide search).

**Notes** — the service still depends on the Node.js runtime, and whatever supply-chain and licensing obligations an adopter's policy attaches to that runtime are unaffected. No `engines` field, `.nvmrc`, or `.node-version` exists, so the supported range is undeclared and compatibility with any given release is unknown rather than guaranteed — assumption A-01. Constraint C-05 records the zero-dependency position.

### US-014 — Execute the source exactly as authored

*As a developer or maintainer, I want the file executed directly with no build stage, so that what I read is what runs.*

**Primary persona** developer or maintainer (`P-01`) · **Covers** `F-004-RQ-003` · **Priority** Must-Have · **Baseline status** Verified · **Verification** source inspection, repository-wide search

**Acceptance criteria**

- The file is executed directly by `node` as CommonJS, loading modules through `require` `[server.js:1]`.
- No bundler or transpiler configuration exists in the repository, and no `src/` or `lib/` directory implies compiled output (repository-wide search).
- The source declares no exports, and the listener binds during module load, so importing the file has side effects rather than yielding an interface `[server.js:12,1-14]`.

**Notes** — constraint C-11 records the consequence — the module cannot be consumed as a library.


## E-05 — Repository Baseline and Licensing Artifacts

Feature `F-005` · epic priority Medium · stories US-015 to US-017.

### US-015 — Determine the terms of reuse without contacting the author

*As a downstream consumer or redistributor, I want the Apache-2.0 licence text at the repository root, so that I can determine my reuse and redistribution obligations unaided.*

**Primary persona** downstream consumer or redistributor (`P-04`) · **Covers** `F-005-RQ-001` · **Priority** Must-Have · **Baseline status** Verified · **Verification** source inspection

**Acceptance criteria**

- `LICENSE` exists at the repository root, is 201 LF-terminated lines and 11,357 bytes, and opens with the licence name, `Version 2.0, January 2004`, and the `apache.org/licenses/` URL `[LICENSE:1-3]`.
- Its text is equivalent to the canonical Apache License 2.0 text published at `apache.org/licenses/LICENSE-2.0.txt`, compared after normalising leading and trailing blank lines and trailing whitespace `[LICENSE:1-201]`.
- All nine numbered clauses are present, running through the end of terms and the appendix `[LICENSE:7-201]`.
- The clauses bearing on reuse are readable in place: redistribution conditions at clause 4 `[LICENSE:89]`, the "AS IS" warranty disclaimer at clause 7 `[LICENSE:143]`, and the liability limitation at clause 8 `[LICENSE:153]`.

**Notes** — the normalising comparison is what `F-005-RQ-001`'s "unmodified" wording is taken to require, and it is stated because published copies of the text differ in leading and trailing blank lines while the substantive text is identical — a raw byte comparison could fail on whitespace alone. The normalising comparison is stated in the conventions note. The repository contains no `NOTICE` file, so clause 4(d)'s obligation to carry a `NOTICE` file's attribution notices into derivative works is not currently triggered `[LICENSE:89-129]`. Constraint C-09 records that these obligations govern reuse.

### US-016 — Identify the repository from its README

*As a downstream consumer or redistributor, I want the repository to identify itself, so that I can tell what I am looking at.*

**Primary persona** downstream consumer or redistributor (`P-04`) · **Covers** `F-005-RQ-002` · **Priority** Should-Have · **Baseline status** Verified minimally · **Verification** source inspection

**Acceptance criteria**

- `README.md` renders a level-one heading naming the repository: `# BlitzyRepo1` `[README.md:1]`.

**Notes** — §2.5.1 of the Technical Specification assesses this requirement as satisfied only minimally, and that assessment is what the baseline status carries — the name is present while the file offers no purpose statement, usage instructions, or run command `[README.md:1]`. Those absences justify the assessment; they are not acceptance conditions, since written as criteria they would fail the moment useful guidance were added. Assumption A-05 relates. The change that publishes this artifact also adds a Documentation section to `README.md` linking it; criteria describe the baseline commit, so that addition is recorded here rather than as a criterion.

### US-017 — Know who holds copyright in the work

*As a downstream consumer or redistributor, I want a copyright holder asserted for this repository, so that I can retain the required attribution notice when I redistribute.*

**Primary persona** downstream consumer or redistributor (`P-04`) · **Covers** `F-005-RQ-003` · **Priority** Should-Have · **Baseline status** Not satisfied · **Verification** source inspection

**Acceptance criteria**

- The repository asserts a copyright holder — a concrete year and a named owner — in a location intended for one, such as a per-file source header or a `NOTICE` file.

**Notes** — the criterion is **not met at the baseline commit**. `server.js` carries no licence header `[server.js:1-14]`, `README.md` carries no copyright line `[README.md:1]`, and no `NOTICE` file exists (repository-wide search); constraint C-10 records the consequence. The Apache appendix supplies the boilerplate intended for this purpose, instructing an adopter to attach it to their work with the bracketed fields replaced and enclosed in the file format's comment syntax `[LICENSE:178-187]`; the line `Copyright [yyyy] [name of copyright owner]` `[LICENSE:189]` is part of that template rather than a field inside `LICENSE` to be edited. Reading the placeholder as a field to edit would modify the licence text `F-005-RQ-001` requires to be unmodified, so satisfaction is a separate notice rather than a licence edit. Satisfying the criterion requires a copyright-owner decision the repository does not hold, and making that change is out of scope for this work.


## Requirement coverage

One row per enumerated requirement identifier. This is the backward direction and is what proves no enumerated requirement was missed; the forward direction is carried by each story's **Covers** field, so no second traceability table exists.

| Requirement identifier | Covered by | Source location | Baseline status |
|---|---|---|---|
| F-001-RQ-001 | US-001 | `[server.js:1,6,12]` | Verified |
| F-001-RQ-002 | US-002, US-004 | `[server.js:3-4,12]` | Verified |
| F-001-RQ-003 | US-003 | `[server.js:6-9]` | Verified |
| F-001-RQ-004 | US-005 | `[server.js:3-4,13]` | Verified |
| F-002-RQ-001 | US-006 | `[server.js:7]` | Verified |
| F-002-RQ-002 | US-007, US-010 | `[server.js:8]` | Verified |
| F-002-RQ-003 | US-008, US-010 | `[server.js:9]` | Verified |
| F-002-RQ-004 | US-009 | `[server.js:6-9]` | Verified |
| F-003-RQ-001 | US-011 | `[server.js:12-13]` | Verified |
| F-003-RQ-002 | US-011 | `[server.js:3-4,13]` | Verified |
| F-004-RQ-001 | US-013 | `[server.js:1]` | Verified |
| F-004-RQ-002 | US-012 | `[server.js:1]` and (repository-wide search) | Verified |
| F-004-RQ-003 | US-014 | `[server.js:1,12]` | Verified |
| F-005-RQ-001 | US-015 | `[LICENSE:1-201]` | Verified |
| F-005-RQ-002 | US-016 | `[README.md:1]` | Verified minimally |
| F-005-RQ-003 | US-017 | `[LICENSE:178-189]` and (repository-wide search) | Not satisfied |

## Identifiers cited

The handles below are **navigational summaries, not definitions**. §2.5.4 and §2.5.5 of the Technical Specification hold the authoritative text; identifiers are cited here and in the stories without reproducing it.

| Identifier | Handle | Source section |
|---|---|---|
| A-01 | Supported runtime range undeclared | §2.5.4 |
| A-02 | Port 3000 assumed free at start | §2.5.4 |
| A-03 | Consumers assumed co-located on the host | §2.5.4 |
| A-04 | External process supervision assumed | §2.5.4 |
| A-05 | Run command undocumented — superseded in part | §2.5.4 |
| A-06 | Callers assumed to need no differentiation | §2.5.4 |
| A-07 | Single English plain-text response assumed acceptable | §2.5.4 |
| C-01 | Endpoint immutable without a source edit | §2.5.5 |
| C-02 | Reachability limited to the loopback interface | §2.5.5 |
| C-03 | One application response representable | §2.5.5 |
| C-04 | One instance per host at the fixed endpoint | §2.5.5 |
| C-05 | Zero third-party dependencies | §2.5.5 |
| C-06 | No environment-specific behavior from configuration | §2.5.5 |
| C-07 | No automated regression protection | §2.5.5 |
| C-08 | Startup failure and shutdown unmanaged | §2.5.5 |
| C-09 | Apache-2.0 obligations govern reuse | §2.5.5 |
| C-10 | No copyright holder asserted | §2.5.5 |
| C-11 | Not consumable as a library | §2.5.5 |
| C-12 | No citable version other than a commit SHA | §2.5.5 |

Two handles are broader than the repository evidences, and each is scoped where it is used: C-04 is scoped on US-011 to an unmodified process in the same network namespace, and C-06 is scoped on US-005 to application configuration.

## Open questions

Each is a question for the product owner, and **none is blocking** — this document is complete with every one of them open.

- The greeting names a product, "Sharebot" `[server.js:9]`, for which the repository contains no capability. Is a Sharebot product intended, and if so, what capability set should a future backlog describe? Non-blocking.
- Who should be asserted as the copyright owner, and from what year, in a repository-specific notice? The appendix template at `[LICENSE:178-189]` is what would be attached once the answer exists. Non-blocking for this document, though it does block *satisfaction* of US-017, whose criterion cannot be met without an owner decision the repository does not hold.
- What Node.js version range is supported? Nothing in the repository declares one (A-01), so consumers currently have no compatibility statement. Non-blocking.
- Is the loopback-only bind `[server.js:3]` an intentional deployment constraint or an artefact of local development? C-02 records the effect; the intent is undocumented. Non-blocking.

## Excluded capabilities

**No story is written for any capability domain below.** Each is absent from the repository, and each absence is recorded in the Technical Specification's scope exclusions at §1.3.2.1, with the unimplemented product name additionally raised at §2.1.6. The register makes the absences explicit rather than leaving them as omissions; it does not restate their content.

| Capability domain | Where the absence is recorded |
|---|---|
| Request routing and method dispatch | §1.3.2.1 |
| Authentication and authorization | §1.3.2.1 |
| TLS and transport security | §1.3.2.1 |
| Input validation and rate limiting | §1.3.2.1 |
| Persistence and caching | §1.3.2.1 |
| Configuration and secrets management | §1.3.2.1 |
| Error handling and graceful shutdown | §1.3.2.1 |
| Structured or per-request logging, metrics, tracing, health endpoints | §1.3.2.1 |
| Clustering and multi-instance operation | §1.3.2.1 |
| CI/CD, containerization, infrastructure-as-code | §1.3.2.1 |
| Sharing, bot, messaging, or account capability implied by the product name in the greeting | §1.3.2.1 and §2.1.6 |

