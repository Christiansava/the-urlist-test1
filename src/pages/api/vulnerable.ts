import type { APIRoute } from "astro";
import { client } from "../../utils/db";
import { exec } from "child_process";
import * as fs from "fs";
import * as path from "path";

// ===========================================
// VULNERABLE API - For CodeQL Testing Only
// DO NOT USE IN PRODUCTION
// ===========================================

// ============================================
// VULNERABILITY 1: SQL Injection
// CodeQL Rule: js/sql-injection
// ============================================
export const GET: APIRoute = async ({ url }) => {
  const userId = url.searchParams.get("userId");
  const username = url.searchParams.get("username");
  const sortBy = url.searchParams.get("sortBy");

  try {
    // VULNERABLE: Direct string concatenation in SQL query
    const query = "SELECT * FROM users WHERE id = " + userId;
    const result = await client.query(query);

    // VULNERABLE: Template literal SQL injection
    if (username) {
      const userQuery = `SELECT * FROM users WHERE username = '${username}'`;
      const userResult = await client.query(userQuery);
      return new Response(JSON.stringify(userResult.rows), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    // VULNERABLE: Dynamic ORDER BY clause
    if (sortBy) {
      const sortedQuery = `SELECT * FROM users ORDER BY ${sortBy}`;
      const sortedResult = await client.query(sortedQuery);
      return new Response(JSON.stringify(sortedResult.rows), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify(result.rows), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};

// ============================================
// VULNERABILITY 2: Command Injection
// CodeQL Rule: js/command-line-injection
// ============================================
export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { action, filename, command, template } = body;

    // VULNERABLE: Command injection via exec
    if (action === "execute") {
      exec(command, (error, stdout, stderr) => {
        console.log(stdout);
      });
      return new Response(JSON.stringify({ message: "Command executed" }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    // VULNERABLE: Command injection via filename
    if (action === "process") {
      exec(`cat ${filename}`, (error, stdout, stderr) => {
        console.log(stdout);
      });
      return new Response(JSON.stringify({ message: "File processed" }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    // ============================================
    // VULNERABILITY 3: Path Traversal
    // CodeQL Rule: js/path-injection
    // ============================================
    if (action === "readFile") {
      // VULNERABLE: No validation of file path - allows ../../../etc/passwd
      const filePath = path.join("/uploads", filename);
      const content = fs.readFileSync(filePath, "utf-8");
      return new Response(JSON.stringify({ content }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    // VULNERABLE: Direct path usage without sanitization
    if (action === "downloadFile") {
      const content = fs.readFileSync(filename, "utf-8");
      return new Response(content, {
        status: 200,
        headers: { "Content-Type": "text/plain" },
      });
    }

    // ============================================
    // VULNERABILITY 4: XSS (Cross-Site Scripting)
    // CodeQL Rule: js/xss, js/reflected-xss
    // ============================================
    if (action === "render") {
      // VULNERABLE: Directly embedding user input in HTML response
      const htmlContent = `
        <html>
          <body>
            <h1>Welcome ${template}</h1>
            <div>${body.userContent}</div>
          </body>
        </html>
      `;
      return new Response(htmlContent, {
        status: 200,
        headers: { "Content-Type": "text/html" },
      });
    }

    // ============================================
    // VULNERABILITY 5: Hardcoded Credentials
    // CodeQL Rule: js/hardcoded-credentials
    // ============================================
    if (action === "adminLogin") {
      const adminPassword = "SuperSecret123!";
      const apiKey = "sk-1234567890abcdef";
      const dbPassword = "postgres_admin_pass";
      
      if (body.password === adminPassword) {
        return new Response(JSON.stringify({ 
          success: true, 
          apiKey: apiKey,
          message: "Logged in with hardcoded credentials"
        }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      }
    }

    // ============================================
    // VULNERABILITY 6: Insecure Randomness
    // CodeQL Rule: js/insecure-randomness
    // ============================================
    if (action === "generateToken") {
      // VULNERABLE: Using Math.random() for security-sensitive token
      const token = Math.random().toString(36).substring(2);
      const sessionId = Math.floor(Math.random() * 1000000);
      
      return new Response(JSON.stringify({ 
        token, 
        sessionId,
        resetCode: Math.random().toString().slice(2, 8)
      }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    // ============================================
    // VULNERABILITY 7: Prototype Pollution
    // CodeQL Rule: js/prototype-pollution
    // ============================================
    if (action === "merge") {
      const target: Record<string, unknown> = {};
      // VULNERABLE: Unsafe object merge allowing __proto__ manipulation
      for (const key in body.source) {
        target[key] = body.source[key];
      }
      return new Response(JSON.stringify(target), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    // ============================================
    // VULNERABILITY 8: Open Redirect
    // CodeQL Rule: js/server-side-unvalidated-url-redirection
    // ============================================
    if (action === "redirect") {
      // VULNERABLE: Redirecting to user-supplied URL without validation
      const redirectUrl = body.url;
      return new Response(null, {
        status: 302,
        headers: { Location: redirectUrl },
      });
    }

    // ============================================
    // VULNERABILITY 9: Log Injection
    // CodeQL Rule: js/log-injection
    // ============================================
    if (action === "log") {
      // VULNERABLE: Logging unsanitized user input
      console.log(`User action: ${body.userInput}`);
      console.log("User data: " + body.userData);
      return new Response(JSON.stringify({ logged: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    // ============================================
    // VULNERABILITY 10: Regex Denial of Service (ReDoS)
    // CodeQL Rule: js/redos
    // ============================================
    if (action === "validate") {
      // VULNERABLE: Regex with catastrophic backtracking
      const emailRegex = /^([a-zA-Z0-9]+)+@[a-zA-Z0-9]+\.[a-zA-Z]+$/;
      const isValid = emailRegex.test(body.email);
      return new Response(JSON.stringify({ valid: isValid }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Invalid action" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};

// ============================================
// VULNERABILITY 11: Missing Rate Limiting
// (Not directly a CodeQL rule but security issue)
// ============================================
export const PUT: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { email, password } = body;

    // VULNERABLE: No rate limiting on password attempts
    // VULNERABLE: Timing attack on password comparison
    const result = await client.query(
      "SELECT * FROM users WHERE email = $1 AND password = $2",
      [email, password]
    );

    if (result.rows.length > 0) {
      // VULNERABLE: Exposing sensitive data in response
      return new Response(JSON.stringify({ 
        success: true, 
        user: result.rows[0] // Includes password hash!
      }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ success: false }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    // VULNERABLE: Exposing internal error details
    return new Response(JSON.stringify({ 
      error: (error as Error).message,
      stack: (error as Error).stack
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};

// ============================================
// VULNERABILITY 12: SSRF (Server-Side Request Forgery)
// CodeQL Rule: js/request-forgery
// ============================================
export const DELETE: APIRoute = async ({ url }) => {
  const targetUrl = url.searchParams.get("url");
  
  if (targetUrl) {
    try {
      // VULNERABLE: Fetching arbitrary URLs provided by user
      const response = await fetch(targetUrl);
      const data = await response.text();
      
      return new Response(JSON.stringify({ 
        fetched: true,
        content: data 
      }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: "Fetch failed" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  }

  return new Response(JSON.stringify({ error: "URL required" }), {
    status: 400,
    headers: { "Content-Type": "application/json" },
  });
};
