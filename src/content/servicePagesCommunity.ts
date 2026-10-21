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
    "Lydia Memorial Hospital’s profile says that, since its inception, the hospital has provided several medical outreaches to the community and beyond. It does not specify their dates, locations or scope.",
    `## A commitment to the community\n\nThis outreach history reflects LMH’s stated mission: to provide affordable, easily accessible excellent healthcare through God’s Gifted hands. The hospital-supplied profile offers no further details about particular outreach activities or their outcomes.\n\n## Ask LMH about current opportunities\n\nThe profile does not confirm whether an outreach is currently available or who may be eligible. Please contact Lydia Memorial Hospital to ask about current availability and to confirm details before making plans.\n\n${contact}`,
    70,
  ),
  servicePage(
    "22000000-0000-4000-8000-000000000008",
    "nhis",
    "NHIS Services",
    "NATIONAL HEALTH INSURANCE SCHEME",
    "Lydia Memorial Hospital’s supplied profile states that LMH received NHIA accreditation for NHIS services in August 2025. Contact the hospital to confirm current availability and eligibility.",
    `## About the accreditation\n\nThe August 2025 accreditation is reported in the hospital-supplied profile. It is a historical statement and does not confirm the hospital’s current NHIS service availability or the details of coverage.\n\n## Confirm your details with LMH\n\nThe profile does not provide information about eligibility, covered services, enrollment or current participation. Please contact Lydia Memorial Hospital directly to ask whether NHIS services are currently available and to confirm any eligibility or enrollment requirements.\n\n${contact}`,
    80,
  ),
  servicePage(
    "22000000-0000-4000-8000-000000000009",
    "immunisation",
    "Immunisation Services",
    "CARE AT LYDIA MEMORIAL HOSPITAL",
    "Lydia Memorial Hospital’s profile states that the Benue State Government approved the hospital for immunisation services. Contact LMH to check current availability and eligibility.",
    `## About the service\n\nLMH lists immunisation services among its approved services, as stated in the hospital-supplied profile. The profile does not provide details about vaccines, age groups, schedules, fees or current availability; please confirm these directly with the hospital.\n\n## The hospital's commitment\n\nLydia Memorial Hospital’s supplied mission is to provide affordable, easily accessible excellent healthcare through God’s Gifted hands. For information about immunisation services, the hospital team can clarify what is currently available.\n\n## Contact Lydia Memorial Hospital\n\nThe hospital is at No. 3 Ejeh Street, Ichakwu-Amejo (Ugbokolo), Edumoga, Okpokwu LGA, Benue State, Nigeria.\n\n${contact}`,
    90,
  ),
  servicePage(
    "22000000-0000-4000-8000-000000000010",
    "art-unit",
    "ART Unit",
    "LYDIA MEMORIAL HOSPITAL",
    "Lydia Memorial Hospital’s profile states that the Benue State Government approved an ART unit at the hospital. Please contact LMH to confirm whether the unit is currently available and who may be eligible.",
    `## About the unit\n\nThe hospital-supplied profile records approval of an ART unit at Lydia Memorial Hospital by the Benue State Government. The profile does not define the unit’s scope, so please contact LMH for current information.\n\n## Care at Lydia Memorial Hospital\n\nLMH’s stated mission is to provide affordable, easily accessible excellent healthcare through God’s Gifted hands. For details about this unit, including current availability and eligibility, please speak directly with the hospital.\n\n## Visit or contact LMH\n\nLydia Memorial Hospital is at No. 3 Ejeh Street, Ichakwu-Amejo (Ugbokolo), Edumoga, Okpokwu LGA, Benue State, Nigeria.\n\n${contact}`,
    100,
  ),
  servicePage(
    "22000000-0000-4000-8000-000000000011",
    "infectious-disease-holding-centre",
    "Infectious-Disease Holding-Centre Designation",
    "A DATED DESIGNATION",
    "Lydia Memorial Hospital’s supplied profile reports that the Benue State Government designated the hospital a holding centre for infectious diseases in early 2025. This dated statement does not confirm current status or capacity.",
    `## About the designation\n\nThe designation is reported in the hospital-supplied profile as having been made in early 2025. It is a dated designation only; it should not be taken as confirmation of present-day designation or a description of treatments, facilities or capacity.\n\n## Confirm current information\n\nFor the most up-to-date information about whether this designation remains in effect, and any current availability or eligibility, please contact Lydia Memorial Hospital directly. LMH’s mission is to provide affordable, easily accessible excellent healthcare through God’s Gifted hands.\n\n${contact}`,
    110,
  ),
];
