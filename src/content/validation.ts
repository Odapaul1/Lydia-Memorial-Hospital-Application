import { z } from "zod";

/**
 * Schemas shared by the API (server-side enforcement) and the admin editor
 * (immediate feedback). They mirror the shapes declared in `types.ts`.
 */

const text = (max: number) => z.string().max(max);
const requiredText = (max: number) => z.string().min(1).max(max);
const mediaUrl = z.string().max(1000);

export const pageCategorySchema = z.enum(["about", "service"]);
export const pageStatusSchema = z.enum(["published", "draft", "archived"]);
export const slugSchema = z.string().min(1).max(100).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers and hyphens");

export const cmsPageSchema = z.object({
  id: z.string().uuid(),
  slug: slugSchema,
  category: pageCategorySchema,
  title: requiredText(200),
  eyebrow: text(180),
  lead: text(2000),
  bodyMarkdown: text(200_000),
  imageUrl: mediaUrl,
  imageAlt: text(500),
  status: pageStatusSchema,
  sortOrder: z.number().int().min(0).max(100_000),
  updatedAt: z.string().optional(),
});

export const heroSlideSchema = z.object({
  imageUrl: mediaUrl,
  imageAlt: text(500),
  imageNote: text(300),
  kicker: text(200),
  title: text(200),
  emphasis: text(200),
  description: text(1000),
});

export const milestoneSchema = z.object({
  dateLabel: text(40),
  dateYear: text(20),
  title: text(200),
  body: text(1000),
});

export const faqSchema = z.object({ question: requiredText(300), answer: requiredText(2000) });

export const doctorSchema = z.object({
  id: requiredText(80),
  name: requiredText(160),
  specialty: requiredText(120),
  role: requiredText(160),
  imageUrl: mediaUrl,
  isAvailable: z.boolean(),
  slug: slugSchema,
});

export const departmentSchema = z.object({
  id: requiredText(80),
  title: requiredText(160),
  category: z.enum(["Medical", "Clinical", "Surgical", "Critical Care", "Women's Health", "Family Care", "Diagnostics"]),
  description: text(600),
  specialistCount: z.number().int().min(0).max(10_000),
  icon: requiredText(40),
});

export const galleryItemSchema = z.object({
  id: requiredText(80),
  type: z.enum(["photo", "video"]),
  title: requiredText(160),
  imageUrl: mediaUrl,
  slug: slugSchema,
});

export const siteSettingsSchema = z.object({
  branding: z.object({
    name: requiredText(160),
    logoUrl: mediaUrl,
    motto: text(160),
    registrationNumber: text(60),
  }),
  contact: z.object({
    phone: requiredText(60),
    email: requiredText(254),
    address: requiredText(500),
  }),
  navigation: z.object({
    homeLabel: requiredText(60),
    aboutLabel: requiredText(60),
    servicesLabel: requiredText(60),
    appointmentLabel: requiredText(60),
    faqLabel: requiredText(60),
    contactLabel: requiredText(60),
    callLabel: requiredText(60),
    exploreLabel: requiredText(60),
    getInTouchLabel: requiredText(60),
  }),
  home: z.object({
    heroSlides: z.array(heroSlideSchema).min(1).max(10),
    aboutEyebrow: text(120),
    aboutTitle: text(200),
    aboutEmphasis: text(200),
    aboutLead: text(1200),
    aboutBodyMarkdown: text(20_000),
    aboutImageUrl: mediaUrl,
    aboutImageAlt: text(500),
    aboutCaptionTitle: text(200),
    aboutCaption: text(200),
    galleryHeroImageUrl: mediaUrl,
    galleryHeroImageAlt: text(500),
    visitImageUrl: mediaUrl,
    visitImageAlt: text(500),
    purposeEyebrow: text(120),
    purposeTitle: text(200),
    purposeBody: text(1200),
    visionTitle: text(200),
    visionBody: text(1200),
    missionTitle: text(200),
    missionBody: text(1200),
    milestones: z.array(milestoneSchema).max(20),
    founderEyebrow: text(120),
    founderTitle: text(200),
    founderEmphasis: text(200),
    founderLead: text(1200),
    founderName: text(200),
    founderCredentials: text(200),
    founderRole: text(200),
    founderImageUrl: mediaUrl,
    founderImageAlt: text(500),
    founderExcerpt: text(4000),
    founderAwards: z.array(text(200)).max(40),
    contactEyebrow: text(120),
    contactTitle: text(200),
    contactEmphasis: text(200),
    contactBody: text(1200),
    footerBlurb: text(500),
    sourceDisclosure: text(1000),
  }),
  faqs: z.array(faqSchema).max(60),
  doctors: z.array(doctorSchema).max(120),
  departments: z.array(departmentSchema).max(120),
  gallery: z.array(galleryItemSchema).max(120),
  appointment: z.object({
    requestEnabled: z.boolean(),
    privacyStatement: text(10_000),
    retentionPolicy: text(10_000),
    approvedAt: z.string().max(40).nullable(),
    approvedBy: z.string().max(200).nullable(),
  }),
});

export const settingsPayloadSchema = z.object({ settings: siteSettingsSchema });

export type CmsPageInput = z.infer<typeof cmsPageSchema>;
export type SiteSettingsInput = z.infer<typeof siteSettingsSchema>;
