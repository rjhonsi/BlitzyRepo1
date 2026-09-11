// Minimal Node.js HTTP server that returns one fixed plain-text greeting for every request.
// Run it with: node server.js

// Use Node's built-in HTTP module; no third-party framework is required.
const http = require('http');

// 127.0.0.1 is the loopback interface: the server is reachable only from the
// local machine and is deliberately not exposed on the network.
const hostname = '127.0.0.1';
// TCP port the server binds to.
const port = 3000;

// Create a server whose handler ignores request details and always sends the same response.
// Node's parser decides what reaches that handler: a method token it does not list is
// answered with its own 400, and CONNECT goes to a 'connect' event nothing here binds.
// @param {http.IncomingMessage} req - the inbound request.
// @param {http.ServerResponse} res - the outbound response.
const server = http.createServer((req, res) => {
  // Report the exchange as a successful HTTP 200 OK.
  res.statusCode = 200;
  // Identify the response body as plain text.
  res.setHeader('Content-Type', 'text/plain');
  // Refuse MIME sniffing so a browser honours the plain-text type declared above
  // instead of guessing a richer one from the bytes and rendering them as markup.
  res.setHeader('X-Content-Type-Options', 'nosniff');
  // Deny framing outright: this greeting is never meant to be embedded in another
  // page, so no origin may load it in a frame and overlay it with its own UI.
  res.setHeader('X-Frame-Options', 'DENY');
  // Write the greeting and end the response in a single call. The trailing
  // newline is part of the payload, so it counts towards Content-Length.
  // Node derives that header when it frames a body, so a HEAD or HTTP/1.0 reply declares none.
  res.end('Hello, World Welcome to Sharebot!\n');
});

// A failed bind emits 'error' on the server; with no listener attached Node
// rethrows it, aborting the process with an internal stack trace and its exact
// runtime version on stderr. Registered before listen() so it is in place for
// the bind attempt, and it logs the error code only - never the error object,
// its message or its stack - so no internal path or version reaches the log.
// @param {Error & { code?: string }} err - the failure reported by the server.
server.on('error', (err) => {
  // Fall back to a neutral label when the platform reports no code, so the
  // diagnostic never degrades into printing the error itself.
  const code = err.code || 'UNKNOWN';
  if (code === 'EADDRINUSE') {
    // Another process already holds the address this server hardcodes: name it
    // so the operator knows which listener to free.
    console.error(`Cannot start server: ${hostname}:${port} is already in use`);
  } else if (code === 'EACCES') {
    // The OS refused the bind, e.g. a privileged or otherwise reserved port.
    console.error(`Cannot start server: permission denied binding ${hostname}:${port}`);
  } else {
    // Any other listen failure is reported by its code alone.
    console.error(`Cannot start server: listen failed with ${code}`);
  }
  // Exit with a defined non-zero status so a supervisor sees a deterministic failure.
  process.exit(1);
});

// Start listening on the configured loopback address.
server.listen(port, hostname, () => {
  // Log the bound address after the listener is ready.
  console.log(`Server running at http://${hostname}:${port}/`);
});
