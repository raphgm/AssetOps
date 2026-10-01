import { execSync } from "child_process";
const ADMIN = "postgresql://assetops:assetops@localhost:5432/postgres";
const URL = "postgresql://assetops:assetops@localhost:5432/assetops_test";
// Recreate the throwaway test database from scratch (never touches the dev/demo database).
export default function setup() {
  execSync(`psql ${ADMIN} -c "DROP DATABASE IF EXISTS assetops_test WITH (FORCE)" -c "CREATE DATABASE assetops_test"`, { stdio: "ignore" });
  execSync("npx prisma db push --skip-generate", { stdio: "ignore", env: { ...process.env, DATABASE_URL: URL } });
}
