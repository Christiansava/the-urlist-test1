import type { APIRoute } from "astro";
import { client } from "../../utils/db";
import { exec, execSync } from "child_process";
import * as fs from "fs";
import * as path from "path";
import * as crypto from "crypto";

// ===========================================
// ⚠️ DEMO FILE - Contains intentional vulnerabilities for CodeQL testing
// ===========================================

// VULNERABILITY: Hardcoded credentials (CWE-798)
const DB_PASSWORD = "admin123!@#";
const API_SECRET = "sk_live_super_secret_key_12345";
const ENCRYPTION_KEY = "mysupersecretkey";

// Weak encryption settings
const WEAK_ALGORITHM = "des";  // DES is considered weak

// ============================================
// VULNERABILITY 1: SQL Injection (CWE-89)
// ============================================
export const GET: APIRoute = async ({ url }) => {
  const userId = url.searchParams.get("userId");
  
  if (userId) {
    // VULNERABLE: User input directly interpolated into SQL query
    const query = `SELECT * FROM users WHERE id = '${userId}'`;
    const result = await client.query(query);
    return new Response(JSON.stringify(result.rows), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }
  
  return new Response("No userId provided", { status: 400 });
};

// ============================================
// VULNERABILITY 2: Command Injection (CWE-78)
// ============================================
export const POST: APIRoute = async ({ request }) => {
  const body = await request.json();
  const { hostname } = body;
  
  if (hostname) {
    return new Promise((resolve) => {
      // VULNERABLE: User input directly in shell command
      exec(`ping -c 4 ${hostname}`, (error, stdout, stderr) => {
        if (error) {
          resolve(new Response(JSON.stringify({ error: stderr }), { status: 500 }));
        } else {
          resolve(new Response(JSON.stringify({ output: stdout }), { status: 200 }));
        }
      });
    });
  }
  
  return new Response("No hostname provided", { status: 400 });
};

// ============================================
// VULNERABILITY 3: Path Traversal (CWE-22)
// ============================================
export const PUT: APIRoute = async ({ request }) => {
  const body = await request.json();
  const { filename } = body;
  
  if (filename) {
    // VULNERABLE: User-controlled filename without sanitization
    const filePath = path.join("/var/data/exports", filename);
    const content = fs.readFileSync(filePath, "utf-8");
    return new Response(content, { status: 200 });
  }
  
  return new Response("No filename provided", { status: 400 });
};

// ============================================
// VULNERABILITY 4: Insecure Deserialization
// ============================================
export const PATCH: APIRoute = async ({ request }) => {
  const body = await request.text();
  
  // VULNERABLE: Using eval on user input
  const data = eval(`(${body})`);
  
  return new Response(JSON.stringify(data), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};
// ============================================
// VULNERABILITY 5: Cross-Site Scripting (XSS) - CWE-79
// ============================================
export const DELETE: APIRoute = async ({ url }) => {
  const message = url.searchParams.get("message") || "Hello";
  const username = url.searchParams.get("username") || "User";
  
  // VULNERABLE: User input directly embedded in HTML without sanitization
  const html = `
    <!DOCTYPE html>
    <html>
      <head><title>Welcome</title></head>
      <body>
        <h1>Hello, ${username}!</h1>
        <div class="message">${message}</div>
        <script>
          var userInput = "${username}";
          document.write("Welcome back, " + userInput);
        </script>
      </body>
    </html>
  `;
  
  return new Response(html, {
    status: 200,
    headers: { "Content-Type": "text/html" },
  });
};

// ============================================
// VULNERABILITY 6: Weak Cryptography (CWE-327)
// ============================================
function encryptData(data: string): string {
  // VULNERABLE: Using weak DES algorithm and MD5
  const key = crypto.createHash('md5').update(ENCRYPTION_KEY).digest();
  const iv = Buffer.alloc(8, 0); // Weak IV
  const cipher = crypto.createCipheriv('des-cbc', key.slice(0, 8), iv);
  return cipher.update(data, 'utf8', 'hex') + cipher.final('hex');
}

// ============================================
// VULNERABILITY 7: Open Redirect (CWE-601)
// ============================================
export const OPTIONS: APIRoute = async ({ url }) => {
  const redirectUrl = url.searchParams.get("next");
  
  if (redirectUrl) {
    // VULNERABLE: Redirecting to user-controlled URL without validation
    return new Response(null, {
      status: 302,
      headers: { "Location": redirectUrl },
    });
  }
  
  return new Response("No redirect URL", { status: 400 });
};

// ============================================
// VULNERABILITY 8: Log Injection (CWE-117)
// ============================================
function logUserAction(username: string, action: string) {
  // VULNERABLE: User input logged without sanitization
  console.log(`[USER] ${username} performed action: ${action}`);
}

// ============================================
// VULNERABILITY 9: Insecure Randomness (CWE-330)
// ============================================
function generateToken(): string {
  // VULNERABLE: Using Math.random() for security-sensitive token
  return Math.random().toString(36).substring(2, 15);
}

function generateSessionId(): string {
  // VULNERABLE: Predictable session ID
  return "session_" + Date.now().toString();
}