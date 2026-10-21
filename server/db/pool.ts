import mysql from "mysql2/promise";
import { config } from "../config";

const connectionUrl = new URL(config.databaseUrl);
const databaseName = decodeURIComponent(connectionUrl.pathname.replace(/^\/+/, ""));
if (!connectionUrl.hostname || !connectionUrl.username || !databaseName) {
  throw new Error("The configured DATABASE_URL is incomplete.");
}

const ssl =
  config.databaseSsl === "disable"
    ? undefined
    : { rejectUnauthorized: config.databaseSsl === "verify" };

export const pool = mysql.createPool({
  host: connectionUrl.hostname,
  port: connectionUrl.port ? Number(connectionUrl.port) : 3306,
  user: decodeURIComponent(connectionUrl.username),
  password: decodeURIComponent(connectionUrl.password),
  database: databaseName,
  ssl,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  charset: "utf8mb4",
  timezone: "Z",
  dateStrings: true,
});
