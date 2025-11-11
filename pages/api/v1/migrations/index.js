import migrationRunner from "node-pg-migrate";
import { join } from "node:path";

import  database from "infra/database";

export default async function migrations(req, res) {
  const allowedMethods = ["GET", "POST"];
  if (!allowedMethods.includes(req.method)) {
    return res.status(405).json({ error: "Method not allowed" });
  }

  let dbClient;
  try {

    dbClient = await database.getNewClientet();

    const defaultMigrations = {
      dbClient,
      dir: join("infra","migrations"),
      direction: "up",
      verbose: true,
      dryRun: true,
    };
    if (req.method === "GET") {
        const pendingMigrations = await migrationRunner(defaultMigrations);
        return res.status(200).json(pendingMigrations);
    }

    if (req.method === "POST") {
      const migratedMigrations = await migrationRunner({ ...defaultMigrations, dryRun: false });
      if (migratedMigrations.length > 0) {
        return res.status(201).json(migratedMigrations); 
      }
      return res.status(200).json(migratedMigrations); 
    }

  } catch (error) {
    console.error("Migration error:", error);
    throw error;
  } finally {
    if (dbClient) {
      await dbClient.end();
    }
  }
}

