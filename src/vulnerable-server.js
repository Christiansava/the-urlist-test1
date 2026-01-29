// Security utilities - DO NOT USE IN PRODUCTION
const { exec, execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const http = require('http');

// Create a simple HTTP server for demo
const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const params = url.searchParams;

  // ============================================
  // VULNERABILITY 1: Command Injection
  // User input goes directly to shell command
  // ============================================
  if (url.pathname === '/ping') {
    const host = params.get('host');
    // BAD: User input in shell command
    exec('ping -c 1 ' + host, (err, stdout) => {
      res.end(stdout || err.message);
    });
    return;
  }

  // ============================================
  // VULNERABILITY 2: Path Traversal
  // User controls file path
  // ============================================
  if (url.pathname === '/read') {
    const filename = params.get('file');
    // BAD: User input in file path
    const content = fs.readFileSync('/data/' + filename);
    res.end(content);
    return;
  }

  // ============================================
  // VULNERABILITY 3: Code Injection via eval
  // User input executed as code
  // ============================================
  if (url.pathname === '/calc') {
    const expr = params.get('expr');
    // BAD: eval with user input
    const result = eval(expr);
    res.end(String(result));
    return;
  }

  // ============================================
  // VULNERABILITY 4: SQL Injection (simulated)
  // String concatenation with user input
  // ============================================
  if (url.pathname === '/user') {
    const id = params.get('id');
    // BAD: SQL injection
    const query = "SELECT * FROM users WHERE id = '" + id + "'";
    res.end(query);
    return;
  }

  // ============================================
  // VULNERABILITY 5: Reflected XSS
  // User input reflected in response
  // ============================================
  if (url.pathname === '/search') {
    const q = params.get('q');
    // BAD: Reflected XSS
    res.setHeader('Content-Type', 'text/html');
    res.end('<html><body>Results for: ' + q + '</body></html>');
    return;
  }

  // ============================================
  // VULNERABILITY 6: Open Redirect
  // User controls redirect URL
  // ============================================
  if (url.pathname === '/redirect') {
    const target = params.get('url');
    // BAD: Open redirect
    res.writeHead(302, { Location: target });
    res.end();
    return;
  }

  res.end('OK');
});

server.listen(3000);
