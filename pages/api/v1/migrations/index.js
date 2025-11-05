import migrationRunner from "node-pg-migrate";
import { join } from "node:path";

import  database from "infra/database";

export default async function migrations(req, res) {
  const dbClient = await database.getNewClientet();
  const defaultMigrations = {
    dbClient,
    dir: join("infra","migrations"),
    direction: "up",
    verbose: true,
    dryRun: true,
  };
  if (req.method === "GET") {
      const pendingMigrations = await migrationRunner(defaultMigrations);
      await dbClient.end();
      return res.status(200).json(pendingMigrations); 
  }

  if (req.method === "POST") {
    const migratedMigrations = await migrationRunner({ ...defaultMigrations, dryRun: false });
    await dbClient.end();
    if (migratedMigrations.length > 0) {
      return res.status(201).json(migratedMigrations); 
    }
    return res.status(200).json(migratedMigrations); 
  }

  return res.status(405).json({ error: "Method not allowed" });
}

