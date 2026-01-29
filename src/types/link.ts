export interface User {
  id: number;
  email: string;
  name: string | null;
  avatar_url: string | null;
  provider: string;
  provider_user_id: string;
  created_at: Date;
  updated_at: Date;
}

export interface Session {
  id: string;
  user_id: number;
  expires_at: Date;
  created_at: Date;
}

export interface List {
  id: number;
  slug: string;
  title: string;
  description: string | null;
  user_id: number | null;
  is_private: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface Link {
  id: number;
  list_id: number;
  url: string;
  title: string | null;
  description: string | null;
  image: string | null;
  position: number;
  created_at: Date;
  updated_at: Date;
}

export interface Metadata {
  title: string | null;
  description: string | null;
  image: string | null;
}
