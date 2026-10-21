import { config } from "../config";
import { constantTimeEquals, verifyPasswordHash } from "./passwordHash";

/**
 * Validates the single administrator account. Email comparison is
 * case-insensitive; the password is checked against the configured scrypt hash
 * when present, otherwise against a plaintext value supplied for local setup.
 */
export async function verifyAdminCredentials(email: string, password: string): Promise<boolean> {
  const emailMatches = constantTimeEquals(email.trim().toLowerCase(), config.adminEmail);
  const passwordMatches = config.adminPasswordHash
    ? await verifyPasswordHash(password, config.adminPasswordHash)
    : constantTimeEquals(password, config.adminPassword);
  return emailMatches && passwordMatches;
}
