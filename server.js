// Minimal Node.js HTTP server that returns one fixed plain-text greeting for every request.

// Use Node's built-in HTTP module; no third-party framework is required.
const http = require('http');

// 127.0.0.1 is the loopback interface: the server is reachable only from the
// local machine and is deliberately not exposed on the network.
const hostname = '127.0.0.1';
// TCP port the server binds to.
const port = 3000;

// Create a server whose handler ignores request details and always sends the same response.
const server = http.createServer((req, res) => {
  // Report the exchange as a successful HTTP 200 OK.
  res.statusCode = 200;
  // Identify the response body as plain text.
  res.setHeader('Content-Type', 'text/plain');
  // Write the greeting and end the response in a single call. The trailing
  // newline is part of the payload, so it counts towards Content-Length.
  res.end('Hello, World Welcome to Sharebot!\n');
});

// Start listening on the configured loopback address.
server.listen(port, hostname, () => {
  // Log the bound address after the listener is ready.
  console.log(`Server running at http://${hostname}:${port}/`);
});
