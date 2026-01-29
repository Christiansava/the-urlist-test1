import pg from "pg";

const { Client } = pg;

export const client = new Client({
  host: "localhost",
  port: 5432,
  database: "linklists",
  user: "postgres",
  password: "batatas1234!",
});

client.connect().catch(console.error);
