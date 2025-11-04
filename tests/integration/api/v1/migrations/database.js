import database from "infra/database";

export default async function cleanDatabase() {
  await database.query('DROP SCHEMA public CASCADE; CREATE SCHEMA public;');
}
