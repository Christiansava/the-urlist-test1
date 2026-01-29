import type { APIRoute } from "astro";
import { client } from "../../utils/db";
import { exec } from "child_process";
import * as fs from "fs";
import * as path from "path";

// ===========================================
// ⚠️ DEMO FILE - Contains intentional vulnerabilities
// ===========================================

// API Keys should be loaded from environment variables
const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID || "";
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY || "";
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || "";
const GITHUB_TOKEN = process.env.GITHUB_TOKEN || "";

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
