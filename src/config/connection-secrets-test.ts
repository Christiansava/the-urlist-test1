// ===========================================
// TEST FILE FOR GITHUB SECRET SCANNING
// NON-PROVIDER PATTERNS (Private Keys, Connection Strings)
// DO NOT USE IN PRODUCTION - TESTING ONLY
// ===========================================

// ============================================
// RSA PRIVATE KEY (rsa_private_key)
// Non-provider pattern - High precision
// ============================================
export const RSA_PRIVATE_KEY = `-----BEGIN RSA PRIVATE KEY-----
MIIEpAIBAAKCAQEA0Z3VS5JJcds3xfn/ygWyF8PbnGy0AHB7MqPr8yx5SLxHFEiP
Q8eKTDHhBFkVPFr4z0MXMXBPD8LxJwKkgJD8YfEXGhXz0t8BBQA4FjK5jdakYxnF
aZ+BXdlBaNSNgJALyJIoZPrMDH2wUZ0L0kdVCFlYPSwYC1yA0dntRvrBsz3LXDQH
iBJNq2L8w7Sh9EaHYXBrYfRmKqd0MqE8LTaWLBtQrYXeHqTJTjwlO2S0s+qDlH5I
smEOLxknhUn2jTzQvNJD8z4X7sbEweKqN2KICD3S0kLPvhnE1VpJMGXqxnKJj9lp
JVLPhHRF0mFEoUMVpAKVELdAK6+m1N/jJRFpWwIDAQABAoIBAC5RgZ+hBx7xHnFZ
nQmY3D9M8M8aA7b5bBLOKxPdT1kR3s8wT0Gnj8LrP3dN9HEiPP0qGvPn7sXl7ZFN
TESTING_ONLY_NOT_REAL_KEY_DATA_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
TESTING_ONLY_NOT_REAL_KEY_DATA_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
TESTING_ONLY_NOT_REAL_KEY_DATA_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
TESTING_ONLY_NOT_REAL_KEY_DATA_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
-----END RSA PRIVATE KEY-----`;

// ============================================
// OPENSSH PRIVATE KEY (openssh_private_key)
// Non-provider pattern - High precision
// ============================================
export const SSH_PRIVATE_KEY = `-----BEGIN OPENSSH PRIVATE KEY-----
b3BlbnNzaC1rZXktdjEAAAAABG5vbmUAAAAEbm9uZQAAAAAAAAABAAACFwAAAAdzc2gtcn
TESTING_ONLY_NOT_REAL_KEY_DATA_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
TESTING_ONLY_NOT_REAL_KEY_DATA_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
TESTING_ONLY_NOT_REAL_KEY_DATA_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
-----END OPENSSH PRIVATE KEY-----`;

// ============================================
// EC PRIVATE KEY (ec_private_key)
// Non-provider pattern - High precision
// ============================================
export const EC_PRIVATE_KEY = `-----BEGIN EC PRIVATE KEY-----
MHQCAQEEIBYa8ezo/jTgDRp4J5EHZKAEVTESTING_NOT_REAL_DATA_XXXXXXX
TESTING_ONLY_NOT_REAL_KEY_DATA_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
TESTING_ONLY_NOT_REAL_KEY_DATA_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
-----END EC PRIVATE KEY-----`;

// ============================================
// GENERIC PRIVATE KEY (generic_private_key)
// Non-provider pattern - High precision
// ============================================
export const GENERIC_PRIVATE_KEY = `-----BEGIN PRIVATE KEY-----
MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDTESTING_ONLY
TESTING_ONLY_NOT_REAL_KEY_DATA_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
TESTING_ONLY_NOT_REAL_KEY_DATA_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
-----END PRIVATE KEY-----`;

// ============================================
// PGP PRIVATE KEY (pgp_private_key)
// Non-provider pattern - High precision
// ============================================
export const PGP_PRIVATE_KEY = `-----BEGIN PGP PRIVATE KEY BLOCK-----

lQPGBGTESTINGBYEKM+ZY7kVWvGNJRqJNTESTING_ONLY_NOT_REAL_XXX
TESTING_ONLY_NOT_REAL_KEY_DATA_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
TESTING_ONLY_NOT_REAL_KEY_DATA_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
-----END PGP PRIVATE KEY BLOCK-----`;

// ============================================
// POSTGRES CONNECTION STRING (postgres_connection_string)
// Non-provider pattern - High precision
// ============================================
export const POSTGRES_CONNECTION_STRING = "postgresql://admin:SuperSecretPassword123!@db.example.com:5432/production_db";

// ============================================
// MYSQL CONNECTION STRING (mysql_connection_string)
// Non-provider pattern - High precision
// ============================================
export const MYSQL_CONNECTION_STRING = "mysql://root:MySecretP@ssw0rd@mysql.example.com:3306/app_database";

// ============================================
// MONGODB CONNECTION STRING (mongodb_connection_string)
// Non-provider pattern - High precision
// ============================================
export const MONGODB_CONNECTION_STRING = "mongodb+srv://dbuser:SecretPassword123@cluster0.xxxxx.mongodb.net/myDatabase?retryWrites=true&w=majority";

// ============================================
// HTTP BASIC AUTHENTICATION HEADER (http_basic_authentication_header)
// Non-provider pattern - Medium precision
// ============================================
export const HTTP_BASIC_AUTH = "Basic YWRtaW46U3VwZXJTZWNyZXRQYXNzd29yZDEyMyE=";

// ============================================
// HTTP BEARER TOKEN (http_bearer_authentication_header)
// Non-provider pattern - Medium precision
// ============================================
export const HTTP_BEARER_TOKEN = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IlRlc3QgVXNlciIsImlhdCI6MTUxNjIzOTAyMn0.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";

// ============================================
// DATABASE CONFIG OBJECT
// Multiple connection strings and credentials
// ============================================
export const DATABASE_CONFIG = {
  // PostgreSQL
  postgres: {
    host: "db.example.com",
    port: 5432,
    user: "admin",
    password: "SuperSecretDbPassword!",
    database: "production",
    connectionString: "postgres://admin:SuperSecretDbPassword!@db.example.com:5432/production",
  },
  
  // MySQL
  mysql: {
    host: "mysql.example.com",
    port: 3306,
    user: "root",
    password: "MySQL_Secret_Pass_123",
    database: "app_db",
  },
  
  // MongoDB
  mongodb: {
    uri: "mongodb://mongouser:MongoPass123!@mongo.example.com:27017/admin",
    replicaSet: "rs0",
  },
  
  // Redis
  redis: {
    host: "redis.example.com",
    port: 6379,
    password: "RedisSecretPassword",
  },
};

// ============================================
// AZURE CREDENTIALS
// Various Azure service credentials
// ============================================
export const AZURE_CONFIG = {
  // Azure Storage Account Key pattern
  storageAccountKey: "DefaultEndpointsProtocol=https;AccountName=mystorageaccount;AccountKey=XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX==;EndpointSuffix=core.windows.net",
  
  // Azure SQL Connection String
  sqlConnectionString: "Server=tcp:myserver.database.windows.net,1433;Initial Catalog=mydb;Persist Security Info=False;User ID=myuser;Password=MyAzureP@ssw0rd!;",
  
  // Azure Service Bus Connection String
  serviceBusConnectionString: "Endpoint=sb://mynamespace.servicebus.windows.net/;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX=",
};

// ============================================
// GOOGLE CLOUD CREDENTIALS
// Service account credentials (JSON format)
// ============================================
export const GOOGLE_CLOUD_CREDENTIALS = {
  type: "service_account",
  project_id: "my-project-123456",
  private_key_id: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDTESTING_ONLY\nTESTING_ONLY_NOT_REAL_KEY_DATA_XXXXX\n-----END PRIVATE KEY-----\n",
  client_email: "my-service-account@my-project-123456.iam.gserviceaccount.com",
  client_id: "123456789012345678901",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
};

// Export all
export const ALL_CONNECTION_SECRETS = {
  rsaKey: RSA_PRIVATE_KEY,
  sshKey: SSH_PRIVATE_KEY,
  ecKey: EC_PRIVATE_KEY,
  genericKey: GENERIC_PRIVATE_KEY,
  pgpKey: PGP_PRIVATE_KEY,
  postgresUrl: POSTGRES_CONNECTION_STRING,
  mysqlUrl: MYSQL_CONNECTION_STRING,
  mongodbUrl: MONGODB_CONNECTION_STRING,
  basicAuth: HTTP_BASIC_AUTH,
  bearerToken: HTTP_BEARER_TOKEN,
  databaseConfig: DATABASE_CONFIG,
  azureConfig: AZURE_CONFIG,
  googleCloud: GOOGLE_CLOUD_CREDENTIALS,
};
