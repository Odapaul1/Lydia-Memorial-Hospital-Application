export interface OAuthIdentity {
  openId: string;
  name: string;
  email: string;
}

interface TokenExchange {
  accessToken?: string;
  tokenType?: string;
  expiresIn?: number;
}

interface UserInfo {
  openId?: string;
  name?: string;
  email?: string;
}

const oauthBase = (): string => {
  const value = process.env.MANUS_OAUTH_API_URL;
  if (!value) throw new Error("Manus OAuth is not configured.");
  return value.replace(/\/+$/, "");
};

export async function exchangeOAuthCode(code: string, redirectUri: string): Promise<string> {
  const clientId = process.env.MANUS_PROJECT_ID;
  if (!clientId) throw new Error("Manus OAuth is not configured.");
  const response = await fetch(`${oauthBase()}/webdev.v1.WebDevAuthPublicService/ExchangeToken`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ clientId, grantType: "authorization_code", code, redirectUri }),
    signal: AbortSignal.timeout(10_000),
  });
  if (!response.ok) throw new Error("OAuth code exchange failed.");
  const token = await response.json() as TokenExchange;
  if (!token.accessToken || (token.tokenType && token.tokenType.toLowerCase() !== "bearer")) {
    throw new Error("OAuth code exchange returned no usable access token.");
  }
  return token.accessToken;
}

export async function fetchOAuthIdentity(accessToken: string): Promise<OAuthIdentity> {
  const response = await fetch(`${oauthBase()}/webdev.v1.WebDevAuthPublicService/GetUserInfo`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ accessToken }),
    signal: AbortSignal.timeout(8_000),
  });
  if (!response.ok) throw new Error("Manus identity lookup failed.");
  const user = await response.json() as UserInfo;
  if (!user.openId || !user.email) throw new Error("Manus identity response was incomplete.");
  return {
    openId: user.openId,
    email: user.email.trim().toLowerCase(),
    name: (user.name ?? "").trim(),
  };
}

export const getOAuthPortalUrl = (): string => {
  const value = process.env.MANUS_OAUTH_PORTAL_URL;
  if (!value) throw new Error("Manus OAuth is not configured.");
  return value.replace(/\/+$/, "");
};
