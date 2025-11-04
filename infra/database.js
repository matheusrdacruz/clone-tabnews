import { Client } from "pg";

async function query(queryObject) {
  let client;
  try {
    client = await getNewClientet();
    const result = await client.query(queryObject);
    return result;
  } catch (error) {
    console.error("Database query error:", error);
    throw error;
  } finally {
    await client.end();
  }
}

async function getNewClientet() {
  const client = new Client({
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    ssl: process.env.POSTGRES_SSLMODE === 'true',
  });
  await client.connect();
  return client;
}

export default {
  query,
  getNewClientet
};