import type { CmsPage } from "./types";
import { defaultAboutPages } from "./aboutPages";
import { defaultCommunityServicePages } from "./servicePagesCommunity";
import { defaultCoreServicePages } from "./servicePagesCore";

export const defaultPages: CmsPage[] = [
  ...defaultAboutPages,
  ...defaultCoreServicePages,
  ...defaultCommunityServicePages,
];
