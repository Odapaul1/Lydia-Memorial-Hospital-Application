import type { CmsPage } from "./types";

const contact = "Call +234 807 569 7064 or email lydiamemorialhospital@gmail.com to confirm current information.";
const servicePage = (id: string, slug: string, title: string, eyebrow: string, lead: string, bodyMarkdown: string, sortOrder: number): CmsPage => ({
  id,
  slug,
  category: "service",
  title,
  eyebrow,
  lead,
  bodyMarkdown,
  imageUrl: "",
  imageAlt: "",
  status: "published",
  sortOrder,
});

export const defaultCommunityServicePages: CmsPage[] = [
  servicePage(
    "22000000-0000-4000-8000-000000000007",
    "community-outreaches",
    "Community Medical Outreaches",
    "CARE BEYOND THE HOSPITAL",
    "We are committed to the wellbeing of Ugbokolo and surrounding areas through regular community medical outreaches.",
    `## A commitment to the community\n\nOur outreach programs reflect our core mission: to provide affordable, easily accessible excellent healthcare through God’s Gifted hands.\n\n## Dedicated Public Health\n\nWe regularly partner with community leaders and health organizations to provide screenings, treatments, and health education to those who need it most.\n\n${contact}`,
    70,
  ),
  servicePage(
    "22000000-0000-4000-8000-000000000008",
    "nhis",
    "NHIS Services",
    "NATIONAL HEALTH INSURANCE SCHEME",
    "Lydia Memorial Hospital is a fully NHIA accredited facility, providing specialized care for all NHIS cardholders.",
    `## Comprehensive Insurance Coverage\n\nWe are proud to be part of the National Health Insurance Scheme, ensuring that quality healthcare is accessible and affordable for our community.\n\n## Specialized Care\n\nAll NHIS cardholders can access our full range of medical services, from routine checkups to specialized treatments.\n\n${contact}`,
    80,
  ),
  servicePage(
    "22000000-0000-4000-8000-000000000009",
    "immunisation",
    "Immunisation Services",
    "PREVENTATIVE CARE",
    "We provide comprehensive, government-approved immunisation services to protect you and your family from preventable diseases.",
    `## Protecting Our Community\n\nLydia Memorial Hospital is an approved center for essential immunisation services, providing safe and effective vaccines for all age groups.\n\n## Professional Administration\n\nOur vaccines are administered by trained professionals in a safe, clinical environment focused on the long-term health of our community.\n\n${contact}`,
    90,
  ),
  servicePage(
    "22000000-0000-4000-8000-000000000010",
    "art-unit",
    "ART Unit",
    "SPECIALIZED TREATMENT",
    "Our government-approved ART unit provides expert, compassionate care and specialized treatment for those in need.",
    `## Specialized Medical Support\n\nThe ART unit at Lydia Memorial Hospital is equipped to provide professional treatment and support in a confidential, respectful environment.\n\n## Expert Care\n\nWe are dedicated to providing affordable, easily accessible excellent healthcare through God’s Gifted hands, ensuring every patient receives the best possible medical attention.\n\n${contact}`,
    100,
  ),
  servicePage(
    "22000000-0000-4000-8000-000000000011",
    "infectious-disease-center",
    "Infectious-Disease Center",
    "PUBLIC HEALTH RESPONSE",
    "Lydia Memorial Hospital is a designated holding centre for infectious diseases, ready to support the community in times of crisis.",
    `## Expert Public Health Response\n\nAs a government-designated holding centre, we are equipped with the facilities and expertise to manage infectious disease cases safely and effectively.\n\n## Community Safety\n\nOur commitment to public health ensures that Ugbokolo has a reliable, expert facility prepared to handle medical challenges with professional excellence.\n\n${contact}`,
    110,
  ),
];
