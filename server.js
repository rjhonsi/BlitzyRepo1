/**
 * Entry point for a minimal Node.js HTTP server.
 *
 * Every incoming request is answered with the same fixed plain-text greeting:
 * the module performs no routing, keeps no state and has no third-party
 * dependencies or build step. Run it directly with `node server.js`.
 */

// Node's built-in `http` module supplies the server implementation, so the
// greeting is served without any third-party web framework. It is a core
// module bundled with the runtime, so there is no installation step.
const http = require('http');

// 127.0.0.1 is the loopback interface: the server is reachable only from the
// local machine and is deliberately not exposed on the network.
const hostname = '127.0.0.1';
// TCP port the server binds to.
const port = 3000;

/**
 * Create the HTTP server instance. Node invokes the handler below once per
 * incoming request, and every invocation produces the identical response.
 *
 * `req` is intentionally never inspected: the same greeting answers every URL
 * and every method, so the server does no routing and needs no request data.
 *
 * @param {http.IncomingMessage} req Incoming request; unused by design.
 * @param {http.ServerResponse} res Response the greeting is written to.
 */
const server = http.createServer((req, res) => {
  // Report the exchange as a successful HTTP 200 OK.
  res.statusCode = 200;
  // Declare the payload as plain text so clients do not try to parse it as
  // HTML or JSON.
  res.setHeader('Content-Type', 'text/plain');
  // Write the greeting and end the response in a single call. The trailing
  // newline is part of the payload, so it counts towards Content-Length.
  res.end('Hello, World Welcome to Sharebot!\n');
});

/**
 * Bind the listener to the host and port configured above and begin accepting
 * connections. `listen` is asynchronous, so readiness is reported through the
 * callback below rather than by this statement returning.
 */
server.listen(port, hostname, () => {
  // Runs once the socket has been bound successfully. The URL is built from the
  // same constants used to bind, so the logged address can never drift from the
  // address actually being served.
  console.log(`Server running at http://${hostname}:${port}/`);
});
