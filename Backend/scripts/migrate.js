const fs = require("fs");
const path = require("path");
require("dotenv").config();
const db = require("../configs/db");

async function migrate() {
  const sqlPath = path.join(__dirname, "..", "migrations", "001_initial_schema.sql");
  const sql = fs.readFileSync(sqlPath, "utf8");
  await db.query(sql);
  console.log("Database schema created or updated.");
}

migrate().then(() => db.end()).catch(async (error) => {
  console.error("Database migration failed:", error.message);
  await db.end();
  process.exitCode = 1;
});
