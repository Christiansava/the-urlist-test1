-- The Urlist Database Schema

-- Users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  avatar_url TEXT,
  provider VARCHAR(50) NOT NULL, -- 'github' or 'google'
  provider_user_id VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(provider, provider_user_id)
);

-- Sessions table
CREATE TABLE sessions (
  id VARCHAR(255) PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Lists table
CREATE TABLE lists (
  id SERIAL PRIMARY KEY,
  slug VARCHAR(255) UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  is_private BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Links table
CREATE TABLE links (
  id SERIAL PRIMARY KEY,
  list_id INTEGER NOT NULL REFERENCES lists(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  title VARCHAR(255),
  description TEXT,
  image TEXT,
  position INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for faster lookups
CREATE INDEX idx_links_list_id ON links(list_id);
CREATE INDEX idx_lists_slug ON lists(slug);
CREATE INDEX idx_lists_user_id ON lists(user_id);
CREATE INDEX idx_sessions_user_id ON sessions(user_id);
CREATE INDEX idx_sessions_expires_at ON sessions(expires_at);
