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
    "Lydia Memorial Hospital provides a wide range of specialist services and community health initiatives dedicated to your wellbeing.",
    `## Hospital facilities and care\n\nLydia Memorial Hospital features a modern emergency unit, specialized eye care, a comprehensive women's and family health center, and advanced surgery and diagnostic facilities.\n\n## Community and public-health services\n\nWe are proud to serve Ugbokolo through community medical outreaches, NHIS accredited services, and specialized public health units including our infectious-disease response center.\n\n## Confirm current information\n\n${contact}`,
    10,
  ),
  servicePage(
    "22000000-0000-4000-8000-000000000002",
    "emergency-care",
    "Emergency Care",
    "CRITICAL RESPONSE",
    "Rapid, life-saving medical intervention when every second counts, delivered by a dedicated team ready for any crisis.",
    `## 24/7 Emergency Response\n\nLydia Memorial Hospital provides round-the-clock emergency care. Our facility is equipped to handle acute medical crises with speed and precision.\n\n## Expert Medical Team\n\nOur doctors and nurses are trained in advanced life support and emergency protocols to ensure the best possible outcomes for our patients.\n\n## Visit or contact LMH\n\nLydia Memorial Hospital is at No. 3 Ejeh Street, Ichakwu-Amejo (Ugbokolo), Edumoga, Okpokwu LGA, Benue State, Nigeria.\n\n${contact}`,
    20,
  ),
  servicePage(
    "22000000-0000-4000-8000-000000000003",
    "eye-care",
    "Eye care",
    "VISION SERVICES",
    "Professional, high-quality eye care from experienced doctors dedicated to protecting and improving your vision.",
    `## Comprehensive Vision Care\n\nWe provide a full range of ophthalmology services, from routine eye exams to specialized treatments for vision preservation.\n\n## Advanced Diagnostics\n\nOur facility uses modern equipment to detect and manage eye conditions, ensuring your vision remains clear and healthy.\n\n## Accessible care\n\nWe are committed to providing affordable, easily accessible excellent healthcare through God’s Gifted hands.\n\n${contact}`,
    30,
  ),
  servicePage(
    "22000000-0000-4000-8000-000000000004",
    "womens-family",
    "Women's & family",
    "FAMILY WELLNESS",
    "Compassionate healthcare tailored for women and their families, supporting wellness at every stage of life.",
    `## Dedicated Women's Health\n\nFrom maternity services to general wellness, we provide a supportive environment for women to receive the care they need.\n\n## Family-Centered Care\n\nWe believe in treating the whole family, ensuring that both mothers and their loved ones have access to quality medical attention.\n\n## Our commitment\n\nWe provide affordable, easily accessible excellent healthcare through God’s Gifted hands.\n\n${contact}`,
    40,
  ),
  servicePage(
    "22000000-0000-4000-8000-000000000005",
    "surgery-diagnostics",
    "Surgery & Diagnostics",
    "ADVANCED MEDICINE",
    "Advanced surgical procedures and precise diagnostic testing to give you the clear answers and effective treatment you deserve.",
    `## Precision Surgery\n\nOur surgical team performs both routine and complex procedures in a sterile, modern environment focused on safety and recovery.\n\n## Accurate Diagnostics\n\nWith our equipped laboratory and imaging services, we provide the accurate data needed for effective treatment planning.\n\n## Ask the hospital\n\nWe are dedicated to providing affordable, easily accessible excellent healthcare through God’s Gifted hands.\n\n${contact}`,
    50,
  ),
];
