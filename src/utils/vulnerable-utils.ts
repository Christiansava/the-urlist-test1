import * as crypto from "crypto";
import * as fs from "fs";

// ===========================================
// VULNERABLE UTILITIES - For CodeQL Testing Only
// DO NOT USE IN PRODUCTION
// ===========================================

// ============================================
// VULNERABILITY: Weak Cryptographic Algorithm
// CodeQL Rule: js/weak-cryptographic-algorithm
// ============================================
export function hashPassword(password: string): string {
  // VULNERABLE: Using MD5 for password hashing
  return crypto.createHash("md5").update(password).digest("hex");
}

export function hashWithSHA1(data: string): string {
  // VULNERABLE: Using SHA1 (deprecated)
  return crypto.createHash("sha1").update(data).digest("hex");
}

// ============================================
// VULNERABILITY: Insufficient Key Size
// CodeQL Rule: js/insufficient-key-size
// ============================================
export function generateWeakKey(): Buffer {
  // VULNERABLE: Key size too small (should be at least 2048 for RSA)
  const { privateKey } = crypto.generateKeyPairSync("rsa", {
    modulusLength: 512,
  });
  return privateKey.export({ type: "pkcs1", format: "der" });
}

// ============================================
// VULNERABILITY: Hardcoded IV
// CodeQL Rule: js/hardcoded-credentials
// ============================================
export function encryptData(data: string, key: string): string {
  // VULNERABLE: Hardcoded initialization vector
  const iv = Buffer.from("1234567890123456");
  const cipher = crypto.createCipheriv("aes-256-cbc", Buffer.from(key.padEnd(32)), iv);
  let encrypted = cipher.update(data, "utf8", "hex");
  encrypted += cipher.final("hex");
  return encrypted;
}

// ============================================
// VULNERABILITY: Eval Usage
// CodeQL Rule: js/eval-call
// ============================================
export function dynamicCalculate(expression: string): unknown {
  // VULNERABLE: Using eval on user input
  return eval(expression);
}

export function executeTemplate(template: string, data: Record<string, unknown>): string {
  // VULNERABLE: Using Function constructor (similar to eval)
  const fn = new Function("data", `with(data) { return \`${template}\`; }`);
  return fn(data);
}

// ============================================
// VULNERABILITY: Unsafe Deserialization
// CodeQL Rule: js/unsafe-deserialization
// ============================================
export function deserializeData(serialized: string): unknown {
  // VULNERABLE: Using eval for deserialization
  return eval("(" + serialized + ")");
}

// ============================================
// VULNERABILITY: Directory Traversal in File Operations
// CodeQL Rule: js/path-injection
// ============================================
export function readUserFile(baseDir: string, userFilename: string): string {
  // VULNERABLE: No sanitization of user-provided filename
  const fullPath = baseDir + "/" + userFilename;
  return fs.readFileSync(fullPath, "utf-8");
}

export function writeUserFile(baseDir: string, userFilename: string, content: string): void {
  // VULNERABLE: Allows writing to arbitrary paths
  const fullPath = `${baseDir}/${userFilename}`;
  fs.writeFileSync(fullPath, content);
}

// ============================================
// VULNERABILITY: Insecure Cookie Settings
// ============================================
export function createSessionCookie(sessionId: string): string {
  // VULNERABLE: Missing HttpOnly, Secure, and SameSite flags
  return `session=${sessionId}; Path=/`;
}

export function createAuthCookie(token: string): string {
  // VULNERABLE: Cookie without proper security attributes
  return `auth=${token}`;
}

// ============================================
// VULNERABILITY: Information Exposure
// ============================================
export function formatError(error: Error): object {
  // VULNERABLE: Exposing full stack trace and internal details
  return {
    message: error.message,
    stack: error.stack,
    name: error.name,
    cause: error.cause,
  };
}

// ============================================
// VULNERABILITY: Insecure Random Token
// CodeQL Rule: js/insecure-randomness
// ============================================
export function generateResetToken(): string {
  // VULNERABLE: Using Math.random for security token
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
}

export function generateVerificationCode(): string {
  // VULNERABLE: Predictable verification codes
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// ============================================
// VULNERABILITY: XML External Entity (XXE) Risk
// ============================================
export function parseConfig(xmlString: string): void {
  // Note: This pattern is vulnerable when used with certain XML parsers
  // that have external entity processing enabled by default
  console.log("Parsing XML config:", xmlString);
}

// ============================================
// VULNERABILITY: Unsafe Regex
// CodeQL Rule: js/redos
// ============================================
export function validateInput(input: string): boolean {
  // VULNERABLE: Regex with potential catastrophic backtracking
  const pattern = /^(a+)+$/;
  return pattern.test(input);
}

export function validateComplexPattern(input: string): boolean {
  // VULNERABLE: Another ReDoS pattern
  const pattern = /^([a-z]+)*$/;
  return pattern.test(input);
}

// ============================================
// VULNERABILITY: Timing Attack on Comparison
// ============================================
export function verifyToken(provided: string, expected: string): boolean {
  // VULNERABLE: Non-constant-time comparison
  return provided === expected;
}

export function checkPassword(input: string, stored: string): boolean {
  // VULNERABLE: Early return exposes timing information
  if (input.length !== stored.length) {
    return false;
  }
  for (let i = 0; i < input.length; i++) {
    if (input[i] !== stored[i]) {
      return false;
    }
  }
  return true;
}

// ============================================
// VULNERABILITY: Missing Input Validation
// ============================================
export function processUserData(data: Record<string, unknown>): void {
  // VULNERABLE: No validation of input types or content
  const query = `INSERT INTO logs (data) VALUES ('${JSON.stringify(data)}')`;
  console.log("Would execute:", query);
}

// ============================================
// VULNERABILITY: Exposed Secrets in Code
// CodeQL Rule: js/hardcoded-credentials
// ============================================
export const CONFIG = {
  // VULNERABLE: Hardcoded secrets
  DATABASE_PASSWORD: "MySecretDbPassword123",
  API_SECRET: "api_secret_key_12345",
  JWT_SECRET: "jwt_super_secret_key",
  ENCRYPTION_KEY: "encryption_key_abc123",
  AWS_ACCESS_KEY: "AKIAIOSFODNN7EXAMPLE",
  AWS_SECRET_KEY: "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY",
};
