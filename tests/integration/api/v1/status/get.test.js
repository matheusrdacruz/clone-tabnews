test("GET to /api/v1/status should return 200", async () => {
  const response = await fetch("http://localhost:3000/api/v1/status");
  expect(response.status).toBe(200);

 const responseBody = await response.json();

 console.log(responseBody);

  const parseUpdateAt = new Date(responseBody.update_at).toISOString();
  expect(responseBody.update_at).toEqual(parseUpdateAt);

  const databasStatus = responseBody.dependencies.database;

  expect(databasStatus.version).toBeDefined();
  expect(databasStatus.version).toBe("16.0");

  expect(databasStatus.opened_connections).toBeDefined();
  expect(databasStatus.opened_connections).toBe(1);
})