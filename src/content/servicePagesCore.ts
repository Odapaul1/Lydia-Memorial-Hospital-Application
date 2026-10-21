import type { CmsPage } from "./types";

const contact = "To confirm current availability and eligibility, call +234 807 569 7064 or email lydiamemorialhospital@gmail.com.";
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

export const defaultCoreServicePages: CmsPage[] = [
  servicePage(
    "22000000-0000-4000-8000-000000000001",
    "services",
    "Care & services",
    "CARE AT LYDIA MEMORIAL",
    "Lydia Memorial Hospital's supplied profile describes several hospital services and community health initiatives. Please confirm current availability and eligibility directly with LMH.",
    `## Hospital facilities and care\n\nThe hospital-supplied profile lists a fully functional physiotherapy unit, ultrasound machine, equipped laboratory, pharmacy and maternity. It does not state current operating schedules, scope or eligibility.\n\n## Community and public-health services\n\nLMH's profile also describes community medical outreaches, NHIS accreditation reported for August 2025, approved immunisation services and an ART unit. The profile records a Benue State Government infectious-disease holding-centre designation in early 2025. Please contact the hospital to verify current status and arrangements.\n\n## Confirm current information\n\n${contact}`,
    10,
  ),
  servicePage(
    "22000000-0000-4000-8000-000000000002",
    "physiotherapy",
    "Physiotherapy",
    "CARE AT LYDIA MEMORIAL HOSPITAL",
    "Lydia Memorial Hospital’s supplied profile describes a fully functional physiotherapy unit. Contact the hospital to ask about current availability and whether the service is suitable for your needs.",
    `## About the unit\n\nThe hospital-supplied profile states that Lydia Memorial Hospital has a fully functional physiotherapy unit. Please confirm the unit’s current availability and service details directly with LMH.\n\n## Our commitment\n\nLMH’s supplied mission is to provide affordable, easily accessible excellent healthcare through God’s Gifted hands. For information about physiotherapy, the team can clarify what is currently available.\n\n## Visit or contact LMH\n\nLydia Memorial Hospital is at No. 3 Ejeh Street, Ichakwu-Amejo (Ugbokolo), Edumoga, Okpokwu LGA, Benue State, Nigeria.\n\n${contact}`,
    20,
  ),
  servicePage(
    "22000000-0000-4000-8000-000000000003",
    "ultrasound",
    "Ultrasound",
    "LYDIA MEMORIAL HOSPITAL",
    "Lydia Memorial Hospital’s supplied profile lists an ultrasound machine at the hospital. For current availability and eligibility, please contact LMH directly.",
    `## Ultrasound at LMH\n\nThe hospital-supplied profile identifies an ultrasound machine at Lydia Memorial Hospital. The profile does not specify service scope or whether ultrasound is currently available, so please check with LMH before making plans.\n\n## Accessible care\n\nLMH’s supplied mission is to provide affordable, easily accessible excellent healthcare through God’s Gifted hands. Contact the hospital to ask about current availability and eligibility for ultrasound.\n\n${contact}`,
    30,
  ),
  servicePage(
    "22000000-0000-4000-8000-000000000004",
    "laboratory",
    "Laboratory",
    "LYDIA MEMORIAL HOSPITAL",
    "Lydia Memorial Hospital’s supplied profile describes the hospital as having a well-equipped laboratory. Learn more by contacting LMH directly.",
    `## Laboratory at LMH\n\nThe hospital-supplied profile describes a well-equipped laboratory at Lydia Memorial Hospital. For details about laboratory services and whether they are currently available, please contact the hospital.\n\n## Our commitment\n\nLMH’s supplied mission is to provide affordable, easily accessible excellent healthcare through God’s Gifted hands. Contact the hospital to confirm current availability and any eligibility requirements.\n\n${contact}`,
    40,
  ),
  servicePage(
    "22000000-0000-4000-8000-000000000005",
    "pharmacy",
    "Pharmacy",
    "LYDIA MEMORIAL HOSPITAL",
    "Lydia Memorial Hospital’s supplied profile lists a pharmacy among its services. For current information about availability and eligibility, please contact the hospital directly.",
    `## Pharmacy at LMH\n\nThe hospital-supplied profile identifies a pharmacy at Lydia Memorial Hospital. Contact the hospital to confirm whether pharmacy services are currently available and to ask about eligibility.\n\n## Ask the hospital\n\nLMH’s supplied mission is to provide affordable, easily accessible excellent healthcare through God’s Gifted hands. For details about the pharmacy, including any information relevant to your visit, please check directly with the hospital.\n\n${contact}`,
    50,
  ),
  servicePage(
    "22000000-0000-4000-8000-000000000006",
    "maternity",
    "Maternity",
    "CARE AT LYDIA MEMORIAL HOSPITAL",
    "Lydia Memorial Hospital’s supplied profile lists maternity among its services. Contact the hospital to ask about current availability and eligibility.",
    `## About this service\n\nThe hospital-supplied profile identifies maternity at Lydia Memorial Hospital. The founder biography also describes work connected with maternal health; it does not provide a detailed maternity service list or schedule.\n\n## Ask LMH\n\nFor details about what is currently available and who may be eligible, please confirm directly with Lydia Memorial Hospital. The hospital’s stated mission is to provide affordable, easily accessible excellent healthcare through God’s Gifted hands.\n\n## Visit or contact\n\nLydia Memorial Hospital is at No. 3 Ejeh Street, Ichakwu-Amejo (Ugbokolo), Edumoga, Okpokwu LGA, Benue State, Nigeria.\n\n${contact}`,
    60,
  ),
];
