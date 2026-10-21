import mysql from "mysql2/promise";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error("DATABASE_URL is not configured for the managed application database.");
}

const connectionUrl = new URL(databaseUrl);
const databaseName = decodeURIComponent(connectionUrl.pathname.replace(/^\/+/, ""));
if (!connectionUrl.hostname || !connectionUrl.username || !databaseName) {
  throw new Error("The configured managed-database URL is incomplete.");
}

export const pool = mysql.createPool({
  host: connectionUrl.hostname,
  port: connectionUrl.port ? Number(connectionUrl.port) : 3306,
  user: decodeURIComponent(connectionUrl.username),
  password: decodeURIComponent(connectionUrl.password),
  database: databaseName,
  ssl: { rejectUnauthorized: true },
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  charset: "utf8mb4",
  timezone: "Z",
  dateStrings: true,
});
