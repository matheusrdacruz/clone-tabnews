import database from "infra/database.js"

async function status(req, res) {
  const databaseName = process.env.POSTGRES_DB;

  const updateAt = new Date().toISOString();
  const databaseVersionValue = await findDatabaseVersion();
  const databaseMaxConnectionsValue = await findMaxConnectionsResult()
  const databaseOpenedConnectionsValue = await findOpenedConnections(databaseName);

  const statusResponse = buildStatusResponse(updateAt, databaseVersionValue, databaseMaxConnectionsValue, databaseOpenedConnectionsValue);
  console.log(statusResponse);
  res.status(200).json(statusResponse);
}

async function findMaxConnectionsResult() {
  const databaseMaxConnectionsResult = await database.query("SHOW max_connections");
  return databaseMaxConnectionsResult.rows[0].max_connections;
}

async function findDatabaseVersion() {
  const databaseVersionResult = await database.query("SHOW server_version;");
  return databaseVersionResult.rows[0].server_version;
}


async function findOpenedConnections(databaseName) {
  // pode ser filtrada por usuario, database, etc
  const query = { text: "SELECT count(*)::int FROM pg_stat_activity where datname = $1;",
    values: [databaseName] };
  const databaseOpenedConnectionsResult = await database.query(query);
  return databaseOpenedConnectionsResult.rows[0].count;
}

function buildStatusResponse(updateAt, databaseVersionValue, databaseMaxConnectionsValue, databaseOpenedConnectionsValue) {
  return {
    update_at: updateAt,
    dependencies: {
      database: {
        version: databaseVersionValue,
        max_connections: databaseMaxConnectionsValue,
        opened_connections: databaseOpenedConnectionsValue,
      },
    },
  };
}

export default status;