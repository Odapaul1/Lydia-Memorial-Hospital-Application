import { hashPassword } from "../auth/passwordHash";

const password = process.argv[2] ?? "";

if (password.length < 8) {
  console.error("Usage: pnpm admin:hash-password <password>");
  console.error("The password must be at least 8 characters long.");
  process.exit(1);
}

const hash = await hashPassword(password);
console.log(hash);
console.log("\nSet this as ADMIN_PASSWORD_HASH in your .env file.");
