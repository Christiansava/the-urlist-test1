// Configuration file for external services
// WARNING: This file contains sensitive credentials for testing purposes

export const config = {
  // Database credentials
  database: {
    host: "prod-db.example.com",
    username: "admin",
    password: "SuperSecretPassword123!",
    connectionString: "postgresql://admin:SuperSecretPassword123!@prod-db.example.com:5432/urlist"
  },

  // AWS Credentials (test keys for secret scanning demo)
  aws: {
    accessKeyId: "AKIAIOSFODNN7EXAMPLE",
    secretAccessKey: "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY",
    region: "us-east-1"
  },

  // GitHub Personal Access Token (fake token for testing)
  github: {
    personalAccessToken: "ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
  },

  // Stripe API Keys (test keys)
  stripe: {
    publishableKey: "pk_live_51ABC123DEF456GHI789JKL",
    secretKey: "sk_live_51ABC123DEF456GHI789JKL"
  },

  // SendGrid API Key
  sendgrid: {
    apiKey: "SG.xxxxxxxxxxxxxxxxxxxxxx.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
  },

  // JWT Secret
  jwt: {
    secret: "my-super-secret-jwt-signing-key-that-should-never-be-exposed"
  },

  // Azure Storage Connection String
  azure: {
    storageConnectionString: "DefaultEndpointsProtocol=https;AccountName=myaccount;AccountKey=abc123def456ghi789jkl012mno345pqr678stu901vwx234yz==;EndpointSuffix=core.windows.net"
  },

  // API Keys for various services
  apiKeys: {
    openai: "sk-proj-abcdefghijklmnopqrstuvwxyz123456",
    internalApi: "api_key_12345_secret_token_for_testing"
  }
};
