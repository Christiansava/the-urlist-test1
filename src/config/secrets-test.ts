// ===========================================
// TEST FILE FOR GITHUB SECRET SCANNING
// DO NOT USE IN PRODUCTION - TESTING ONLY
// ===========================================

// ============================================
// AWS CREDENTIALS (aws_access_key_id, aws_secret_access_key)
// High confidence detection
// ============================================
export const AWS_CONFIG = {
  accessKeyId: "AKIAIOSFODNN7EXAMPLE",
  secretAccessKey: "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY",
  region: "us-east-1",
};

// ============================================
// GITHUB PERSONAL ACCESS TOKEN (github_personal_access_token)
// High confidence detection
// ============================================
export const GITHUB_TOKEN = "ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";

// ============================================
// STRIPE API KEY (stripe_api_key)
// High confidence detection
// ============================================
export const STRIPE_CONFIG = {
  secretKey: "sk_live_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  publishableKey: "pk_live_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
};

// ============================================
// SLACK API TOKEN (slack_api_token)
// High confidence detection
// ============================================
export const SLACK_TOKEN = "xoxb-xxxxxxxxxxxx-xxxxxxxxxxxx-xxxxxxxxxxxxxxxxxxxxxxxx";

// ============================================
// OPENAI API KEY (openai_api_key)
// High confidence detection
// ============================================
export const OPENAI_API_KEY = "sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";

// ============================================
// SENDGRID API KEY (sendgrid_api_key)
// High confidence detection
// ============================================
export const SENDGRID_API_KEY = "SG.xxxxxxxxxxxxxxxxxxxx.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";

// ============================================
// TWILIO (twilio_account_sid, twilio_api_key)
// High confidence detection
// ============================================
export const TWILIO_CONFIG = {
  accountSid: "ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  authToken: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
};

// ============================================
// NPM ACCESS TOKEN (npm_access_token)
// High confidence detection
// ============================================
export const NPM_TOKEN = "npm_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";

// ============================================
// DISCORD BOT TOKEN (discord_bot_token)
// Removed - triggers push protection
// ============================================
// export const DISCORD_TOKEN = "removed-triggers-push-protection";

// ============================================
// MAILCHIMP API KEY (mailchimp_api_key)
// High confidence detection
// ============================================
export const MAILCHIMP_API_KEY = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx-us1";

// ============================================
// DATADOG API KEY (datadog_api_key)
// High confidence detection
// ============================================
export const DATADOG_CONFIG = {
  apiKey: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  appKey: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
};

// ============================================
// HEROKU API KEY (heroku_api_key)
// High confidence detection
// ============================================
export const HEROKU_API_KEY = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx";

// ============================================
// DIGITALOCEAN TOKEN (digitalocean_oauth_token)
// High confidence detection
// ============================================
export const DIGITALOCEAN_TOKEN = "dop_v1_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";

// ============================================
// PYPI API TOKEN (pypi_api_token)
// High confidence detection
// ============================================
export const PYPI_TOKEN = "pypi-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";

// ============================================
// RUBYGEMS API KEY (rubygems_api_key)
// High confidence detection
// ============================================
export const RUBYGEMS_API_KEY = "rubygems_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";

// ============================================
// NUGET API KEY (nuget_api_key)
// High confidence detection
// ============================================
export const NUGET_API_KEY = "oy2xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";

// ============================================
// PULUMI ACCESS TOKEN (pulumi_access_token)
// High confidence detection
// ============================================
export const PULUMI_TOKEN = "pul-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";

// ============================================
// TERRAFORM API TOKEN (terraform_api_token)
// High confidence detection
// ============================================
export const TERRAFORM_TOKEN = "xxxxxx.atlasv1.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";

// ============================================
// DOPPLER SERVICE TOKEN (doppler_service_token)
// High confidence detection
// ============================================
export const DOPPLER_TOKEN = "dp.st.xxxxxxxxxxxx.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";

// ============================================
// POSTMAN API KEY (postman_api_key)
// High confidence detection
// ============================================
export const POSTMAN_API_KEY = "PMAK-xxxxxxxxxxxxxxxxxxxxxxxx-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";

// ============================================
// LINEAR API KEY (linear_api_key)
// High confidence detection
// ============================================
export const LINEAR_API_KEY = "lin_api_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";

// ============================================
// NOTION API TOKEN (notion_api_token)
// High confidence detection
// ============================================
export const NOTION_TOKEN = "secret_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";

// ============================================
// AIRTABLE API KEY (airtable_api_key)
// High confidence detection  
// ============================================
export const AIRTABLE_API_KEY = "keyXXXXXXXXXXXXXX";

// ============================================
// FIGMA PERSONAL ACCESS TOKEN (figma_pat)
// High confidence detection
// ============================================
export const FIGMA_TOKEN = "figd_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";

// ============================================
// VERCEL API KEY (vercel_api_key)
// High confidence detection
// ============================================
export const VERCEL_TOKEN = "xxxxxxxxxxxxxxxxxxxxxxxxxxxx";

// ============================================
// GRAFANA API KEY (grafana_cloud_api_key)
// High confidence detection
// ============================================
export const GRAFANA_API_KEY = "glc_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";

// ============================================
// SENTRY AUTH TOKEN (sentry_auth_token)
// High confidence detection
// ============================================
export const SENTRY_TOKEN = "sntrys_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";

// Export all configs (DO NOT USE IN PRODUCTION)
export const ALL_SECRETS = {
  aws: AWS_CONFIG,
  github: GITHUB_TOKEN,
  stripe: STRIPE_CONFIG,
  slack: SLACK_TOKEN,
  openai: OPENAI_API_KEY,
  sendgrid: SENDGRID_API_KEY,
  twilio: TWILIO_CONFIG,
  npm: NPM_TOKEN,
  // discord: DISCORD_TOKEN, // removed - triggers push protection
  mailchimp: MAILCHIMP_API_KEY,
  datadog: DATADOG_CONFIG,
  heroku: HEROKU_API_KEY,
  digitalocean: DIGITALOCEAN_TOKEN,
  pypi: PYPI_TOKEN,
  rubygems: RUBYGEMS_API_KEY,
  nuget: NUGET_API_KEY,
  pulumi: PULUMI_TOKEN,
  terraform: TERRAFORM_TOKEN,
  doppler: DOPPLER_TOKEN,
  postman: POSTMAN_API_KEY,
  linear: LINEAR_API_KEY,
  notion: NOTION_TOKEN,
  airtable: AIRTABLE_API_KEY,
  figma: FIGMA_TOKEN,
  vercel: VERCEL_TOKEN,
  grafana: GRAFANA_API_KEY,
  sentry: SENTRY_TOKEN,
};
