import type { CmsPage } from "./types";

const page = (id: string, slug: string, title: string, eyebrow: string, lead: string, bodyMarkdown: string, sortOrder: number, imageUrl = "", imageAlt = ""): CmsPage => ({
  id,
  slug,
  category: "about",
  title,
  eyebrow,
  lead,
  bodyMarkdown,
  imageUrl,
  imageAlt,
  status: "published",
  sortOrder,
});

export const defaultAboutPages: CmsPage[] = [
  page(
    "11000000-0000-4000-8000-000000000001",
    "about",
    "About Lydia Memorial Hospital",
    "OUR STORY",
    "Lydia Memorial Hospital is a premier private medical facility located in Ugbokolo, Benue State, Nigeria.",
    `## A calm, supportive atmosphere\n\nWe provide a therapeutically calm, comfortable, and psychologically supportive atmosphere focused on our patients' complete wellbeing. Our environment is one where everyone is welcomed with kindness, dignity, and specialized attention.\n\n## Founded for service\n\nLydia Memorial Hospital was officially founded and commissioned on 6 June 2022 by Distinguished Senator Abba Moro. Our practice is guided by the motto **Gifted Hands.** Registration number: **3734742**.\n\n## Rooted in Ugbokolo\n\nWe are located at No. 3 Ejeh Street, Ichakwu-Amejo (Ugbokolo), Edumoga, Okpokwu Local Government Area, Benue State, Nigeria. We invite you to contact us directly to arrange your visit or inquire about our services.`,
    10,
    "/manus-storage/about-story_2b92662d.jpg",
    "Healthcare professionals dedicated to patient care at Lydia Memorial Hospital.",
  ),
  page(
    "11000000-0000-4000-8000-000000000002",
    "vision-mission",
    "Vision & Mission",
    "OUR PURPOSE",
    "We are committed to complete patient wellbeing and excellence in medical practice through professional care and compassion.",
    `## Our vision\n\nTo ensure a complete state of wellbeing for patients and promote healthy medical practices in all forms.\n\n## Our mission\n\nTo provide affordable and easily accessible excellent healthcare services through God's Gifted hands in the purest form.\n\n## Our motto\n\n**Gifted Hands.**`,
    20,
  ),
  page(
    "11000000-0000-4000-8000-000000000003",
    "our-story",
    "Our Story",
    "SERVING UGBOKOLO & OKPOKWU",
    "Founded in 2022, Lydia Memorial Hospital is a dedicated private hospital serving the Ugbokolo community and surrounding areas.",
    `## 2022 — founded and commissioned\n\nLydia Memorial Hospital was founded and commissioned on 6 June 2022 by Distinguished Senator Abba Moro. We are committed to providing essential medical services and building strong relationships with our community and professional partners.\n\n## Community outreach\n\nSince our inception, we have conducted numerous medical outreaches to serve the health needs of Ugbokolo and the broader Benue State region.\n\n## Milestones and achievements\n\nIn early 2025, the Benue State Government designated Lydia Memorial Hospital as a holding centre for infectious diseases. In August 2025, we achieved full NHIA accreditation for NHIS services, furthering our commitment to accessible healthcare for all.`,
    30,
  ),
  page(
    "11000000-0000-4000-8000-000000000004",
    "our-founder",
    "Our Founder",
    "LEADERSHIP, MEDICINE & SERVICE",
    "Amb. Dr Mark A. C. Ogbodo, Dist-FIGPCM, is the Founder, Medical Director, and CEO of Lydia Memorial Hospital.",
    `## A commitment to serve\n\nA native of Obi Local Government Area in Benue State, Amb. Dr Mark A. C. Ogbodo established Lydia Memorial Hospital with a vision of medicine as a sacred responsibility to serve. His practice is defined by professional excellence, patient dignity, and compassion.\n\n## Education and leadership\n\nDr Ogbodo earned his medical degree from Igbinedion University, Okada. He holds advanced certification in Leadership and Management in Health from the University of Washington, is a certified Global Peace Ambassador, and a licensed Conflict Manager through the Institute of Global Peace and Conflict Management. His professional standing is further supported by achievements from the British Council, Public Health England, and the London School of Hygiene and Tropical Medicine.\n\n## Author and publisher\n\nAs CEO of Adigwu Publishers, Dr Ogbodo is the author of several acclaimed works, including *Untold* (2023), *Amour Maternel* (2021), and *The Journey — A Flight to Greatness After a Long Walk* (2017). His literary contributions are recognized by the Nigerian Educational Research and Development Council and the Benue State Ministry of Education.\n\n## Professional service\n\nDr Ogbodo serves as the Assistant Secretary of the Association of Nigerian Private Medical Practitioners, Benue State Branch. He has previously served as Chairman of the Publication Committee and Public Relations Officer for the Nigerian Medical Association (NMA), Benue State chapter.\n\n## Recognition and community involvement\n\nHis numerous honors include Merit Man of the Year (2025), the Global Peace Award (2025), and the NMA Benue Award of Excellence (2024). Dr Ogbodo is also deeply involved in community mentorship and faith-based leadership.`,
    40,
    "/manus-storage/lydia-founder-portrait_9d0ab916.jpg",
    "Amb. Dr Mark A. C. Ogbodo, Founder and CEO of Lydia Memorial Hospital.",
  ),
];
