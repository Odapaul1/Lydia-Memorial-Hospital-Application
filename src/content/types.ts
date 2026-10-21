export type PageCategory = "about" | "service";
export type PageStatus = "published" | "draft" | "archived";

export interface HeroSlide {
  imageUrl: string;
  imageAlt: string;
  imageNote: string;
  kicker: string;
  title: string;
  emphasis: string;
  description: string;
}

export interface Milestone {
  dateLabel: string;
  dateYear: string;
  title: string;
  body: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  role: string;
  imageUrl: string;
  isAvailable: boolean;
  slug: string;
}

export interface Department {
  id: string;
  title: string;
  category: "Medical" | "Clinical" | "Surgical" | "Critical Care" | "Women's Health" | "Family Care" | "Diagnostics";
  description: string;
  specialistCount: number;
  icon: string;
}

export interface GalleryItem {
  id: string;
  type: "photo" | "video";
  title: string;
  imageUrl: string;
  slug: string;
}

export type MediaStatus = "active" | "retired";

/** An image stored in the media library (object storage) and usable in page content. */
export interface MediaAsset {
  id: string;
  storageKey: string;
  /** Publicly resolvable URL, derived from the configured media host. */
  url: string;
  mimeType: string;
  byteSize: number;
  altText: string;
  status: MediaStatus;
  createdAt: string;
}

export interface CmsPage {
  id: string;
  slug: string;
  category: PageCategory;
  title: string;
  eyebrow: string;
  lead: string;
  bodyMarkdown: string;
  imageUrl: string;
  imageAlt: string;
  status: PageStatus;
  sortOrder: number;
  updatedAt?: string;
}

export interface SiteSettings {
  branding: {
    name: string;
    logoUrl: string;
    motto: string;
    registrationNumber: string;
  };
  contact: {
    phone: string;
    email: string;
    address: string;
  };
  navigation: {
    homeLabel: string;
    aboutLabel: string;
    servicesLabel: string;
    appointmentLabel: string;
    faqLabel: string;
    contactLabel: string;
    callLabel: string;
    exploreLabel: string;
    getInTouchLabel: string;
  };
  home: {
    heroSlides: HeroSlide[];
    aboutEyebrow: string;
    aboutTitle: string;
    aboutEmphasis: string;
    aboutLead: string;
    aboutBodyMarkdown: string;
    aboutImageUrl: string;
    aboutImageAlt: string;
    aboutCaptionTitle: string;
    aboutCaption: string;
    galleryHeroImageUrl: string;
    galleryHeroImageAlt: string;
    visitImageUrl: string;
    visitImageAlt: string;
    purposeEyebrow: string;
    purposeTitle: string;
    purposeBody: string;
    visionTitle: string;
    visionBody: string;
    missionTitle: string;
    missionBody: string;
    milestones: Milestone[];
    founderEyebrow: string;
    founderTitle: string;
    founderEmphasis: string;
    founderLead: string;
    founderName: string;
    founderCredentials: string;
    founderRole: string;
    founderImageUrl: string;
    founderImageAlt: string;
    founderExcerpt: string;
    founderAwards: string[];
    contactEyebrow: string;
    contactTitle: string;
    contactEmphasis: string;
    contactBody: string;
    footerBlurb: string;
    sourceDisclosure: string;
  };
  faqs: FaqItem[];
  doctors: Doctor[];
  departments: Department[];
  gallery: GalleryItem[];
  appointment: {
    requestEnabled: boolean;
    privacyStatement: string;
    retentionPolicy: string;
    approvedAt: string | null;
    approvedBy: string | null;
  };
}

export interface PublicSitePayload {
  settings: SiteSettings;
  pages: CmsPage[];
}

export interface AppointmentRequest {
  id: string;
  patientName: string;
  phone: string;
  email: string | null;
  serviceSlug: string;
  preferredDate: string;
  preferredTime: string;
  status: "new" | "contacted" | "confirmed" | "closed";
  createdAt: string;
  updatedAt: string;
}

export interface AdminIdentity {
  openId: string;
  email: string;
  name: string;
}

export interface BackupData {
  exportedAt: string;
  settings: SiteSettings;
  pages: CmsPage[];
  appointments: AppointmentRequest[];
  revisions: Array<{
    id: string;
    entityType: string;
    entityKey: string;
    snapshot: unknown;
    createdAt: string;
    createdBy: string;
  }>;
  media: Array<{
    id: string;
    storageKey: string;
    path: string;
    mimeType: string;
    byteSize: number;
    altText: string;
    status: "active" | "retired";
    createdAt: string;
  }>;
}
