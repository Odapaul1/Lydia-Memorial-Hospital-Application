import { pagePath, sortPages } from "./routes";
import type { CmsPage, PageCategory } from "./types";

/**
 * Page lookups are pure functions over the page list supplied by the site
 * content provider, so every screen renders whatever the CMS currently holds.
 */

export const pagesFor = (pages: CmsPage[], category: PageCategory): CmsPage[] =>
  sortPages(pages.filter((item) => item.category === category));

export const baseSlug = (category: PageCategory): string => (category === "about" ? "about" : "services");

export const findPage = (pages: CmsPage[], category: PageCategory, slug?: string): CmsPage | undefined =>
  pagesFor(pages, category).find((item) => item.slug === (slug ?? baseSlug(category)));

export { pagePath };
