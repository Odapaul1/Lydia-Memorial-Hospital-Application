import type { AdminIdentity, CmsPage, MediaAsset, PageStatus, PublicSitePayload, SiteSettings } from "./types";

/**
 * Thin client for the CMS API. The public payload is what every visitor page
 * reads; the admin helpers are only used by the /admin screens.
 */

export class ApiError extends Error {
  readonly status: number;
  readonly code: string;

  constructor(status: number, code: string) {
    super(code);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
  }
}

let csrfToken: string | null = null;

const readError = async (response: Response): Promise<ApiError> => {
  let code = `http_${response.status}`;
  try {
    const body = (await response.json()) as { error?: string };
    if (typeof body?.error === "string") code = body.error;
  } catch {
    // Non-JSON error body; keep the generic code.
  }
  return new ApiError(response.status, code);
};

export async function ensureCsrfToken(): Promise<string> {
  if (csrfToken) return csrfToken;
  const response = await fetch("/api/security/csrf", { credentials: "same-origin" });
  if (!response.ok) throw await readError(response);
  const body = (await response.json()) as { csrfToken?: string };
  csrfToken = body.csrfToken ?? "";
  return csrfToken;
}

export const resetCsrfToken = (): void => {
  csrfToken = null;
};

async function request<T>(path: string, init: RequestInit = {}, allowCsrfRetry = true): Promise<T> {
  const method = (init.method ?? "GET").toUpperCase();
  const headers = new Headers(init.headers);
  if (method !== "GET" && method !== "HEAD") {
    headers.set("x-csrf-token", await ensureCsrfToken());
  }
  const response = await fetch(path, { ...init, method, headers, credentials: "same-origin" });
  if (response.status === 403 && allowCsrfRetry && method !== "GET") {
    csrfToken = null;
    return request<T>(path, init, false);
  }
  if (!response.ok) throw await readError(response);
  if (response.status === 204) return undefined as T;
  return (await response.json()) as T;
}

/* ------------------------------------------------------------------ public */

export const fetchPublicContent = async (signal?: AbortSignal): Promise<PublicSitePayload> =>
  request<PublicSitePayload>("/api/public/content", { signal });

/* ------------------------------------------------------------------- admin */

export const fetchAdminSession = async (): Promise<AdminIdentity> => {
  const body = await request<{ admin: AdminIdentity }>("/api/admin/session");
  return body.admin;
};

export const adminLogin = async (email: string, password: string): Promise<AdminIdentity> => {
  const body = await request<{ admin: AdminIdentity; csrfToken: string }>("/api/admin/login", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  csrfToken = body.csrfToken;
  return body.admin;
};

export const adminLogout = async (): Promise<void> => {
  await request<{ ok: boolean }>("/api/admin/logout", { method: "POST" });
  csrfToken = null;
};

export const fetchAdminContent = async (): Promise<PublicSitePayload> =>
  request<PublicSitePayload>("/api/admin/content");

export const saveSiteSettings = async (settings: SiteSettings): Promise<SiteSettings> => {
  const body = await request<{ settings: SiteSettings }>("/api/admin/settings", {
    method: "PUT",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ settings }),
  });
  return body.settings;
};

export const createPage = async (page: Omit<CmsPage, "id" | "updatedAt">): Promise<CmsPage> => {
  const body = await request<{ page: CmsPage }>("/api/admin/pages", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(page),
  });
  return body.page;
};

export const savePage = async (page: CmsPage): Promise<CmsPage> => {
  const body = await request<{ page: CmsPage }>(`/api/admin/pages/${encodeURIComponent(page.id)}`, {
    method: "PUT",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(page),
  });
  return body.page;
};

export const setPageStatus = async (id: string, status: PageStatus): Promise<void> => {
  await request<{ ok: boolean }>(`/api/admin/pages/${encodeURIComponent(id)}/status`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ status }),
  });
};

/* ------------------------------------------------------------------- media */

export const listMedia = async (): Promise<MediaAsset[]> => {
  const body = await request<{ media: MediaAsset[] }>("/api/admin/media");
  return body.media;
};

export const uploadMedia = async (file: File, altText = ""): Promise<MediaAsset> => {
  const form = new FormData();
  form.append("altText", altText);
  form.append("file", file);
  const body = await request<{ asset: MediaAsset }>("/api/admin/media", { method: "POST", body: form });
  return body.asset;
};

export const updateMediaAltText = async (id: string, altText: string): Promise<MediaAsset> => {
  const body = await request<{ asset: MediaAsset }>(`/api/admin/media/${encodeURIComponent(id)}`, {
    method: "PATCH",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ altText }),
  });
  return body.asset;
};

export const setMediaStatus = async (id: string, status: MediaAsset["status"]): Promise<MediaAsset> => {
  const body = await request<{ asset: MediaAsset }>(`/api/admin/media/${encodeURIComponent(id)}/status`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ status }),
  });
  return body.asset;
};
