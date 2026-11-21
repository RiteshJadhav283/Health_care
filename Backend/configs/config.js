module.exports = {
  host: process.env.PG_HOST || "localhost",
  user: process.env.PG_USER, // PostgreSQL username
  database: process.env.PG_DATABASE, // PostgreSQL database name
  password: process.env.PG_PASSWORD, // PostgreSQL password
  port: process.env.PG_PORT, // PostgreSQL port
};
