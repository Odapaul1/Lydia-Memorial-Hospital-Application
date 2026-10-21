import type { CmsPage } from "./types";

export const pagePath = (page: Pick<CmsPage, "category" | "slug">): string => {
  const base = page.category === "about" ? "about" : "services";
  if (page.slug === base) return `/${base}`;
  return `/${base}/${page.slug}`;
};

export const isValidSlug = (value: string): boolean =>
  value.length > 0 && value.length <= 100 && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value);

export const sortPages = <T extends Pick<CmsPage, "sortOrder" | "title">>(pages: T[]): T[] =>
  [...pages].sort((a, b) => a.sortOrder - b.sortOrder || a.title.localeCompare(b.title));
