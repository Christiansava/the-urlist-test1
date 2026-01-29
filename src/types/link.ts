export interface List {
  id: number;
  slug: string;
  title: string;
  description: string | null;
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
