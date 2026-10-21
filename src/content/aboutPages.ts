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
    "Lydia Memorial Hospital is a private hospital at No. 3 Ejeh Street, Ichakwu-Amejo (Ugbokolo), Edumoga, Okpokwu Local Government Area, Benue State, Nigeria.",
    `## A calm, supportive atmosphere\n\nThe hospital's May 2026 profile describes a therapeutically calm, comfortable and psychologically supportive atmosphere focused on a patient's complete wellbeing. It portrays the hospital environment as one where people are welcomed with kindness, dignity and attention. This description is presented as supplied by LMH, not as an independent assessment.\n\n## Founded for service\n\nLydia Memorial Hospital was founded and commissioned on 6 June 2022 by Distinguished Senator Abba Moro, according to the hospital's profile. Its motto is **Gifted Hands.** Registration number: **3734742**.\n\n## Rooted in Ugbokolo\n\nThe hospital's address is No. 3 Ejeh Street, Ichakwu-Amejo (Ugbokolo), Edumoga, Okpokwu Local Government Area, Benue State, Nigeria. For current access, service availability and visit arrangements, please contact the hospital directly.`,
    10,
    "/manus-storage/about-story_2b92662d.jpg",
    "Illustrative healthcare image; not a photograph of Lydia Memorial Hospital.",
  ),
  page(
    "11000000-0000-4000-8000-000000000002",
    "vision-mission",
    "Vision & Mission",
    "OUR PURPOSE",
    "Lydia Memorial Hospital's stated vision is complete patient wellbeing and the promotion of healthy medical practices; its mission is to provide affordable, easily accessible excellent healthcare through God's Gifted hands.",
    `## Our vision\n\nTo ensure a complete state of wellbeing for patients and promote healthy medical practices in all forms.\n\n## Our mission\n\nTo provide affordable and easily accessible excellent healthcare services through God's Gifted hands in the purest form.\n\n## Our motto\n\n**Gifted Hands.**\n\nThese statements are reproduced from information supplied by Lydia Memorial Hospital.`,
    20,
  ),
  page(
    "11000000-0000-4000-8000-000000000003",
    "our-story",
    "Our Story",
    "SERVING UGBOKOLO & OKPOKWU",
    "Founded in 2022, Lydia Memorial Hospital's supplied profile describes a private hospital serving the community from Ichakwu-Amejo (Ugbokolo), Benue State.",
    `## 2022 — founded and commissioned\n\nLydia Memorial Hospital was founded and commissioned on 6 June 2022 by Distinguished Senator Abba Moro. The hospital's profile describes its work as providing medical services in the rural area and building relationships with government, stakeholders and professional bodies.\n\n## Community outreach\n\nThe hospital-supplied profile says that LMH has provided several medical outreaches to the community and beyond since its inception. It does not give dates, locations, counts, scopes or outcomes for individual outreaches.\n\n## Milestones reported by the hospital\n\nThe profile states that the Benue State Government designated LMH a holding centre for infectious diseases in early 2025, and that NHIA accreditation for NHIS services was received in August 2025. These are dated, hospital-supplied statements and do not confirm current status or availability. Please contact LMH for current information.`,
    30,
  ),
  page(
    "11000000-0000-4000-8000-000000000004",
    "our-founder",
    "Our Founder",
    "LEADERSHIP, MEDICINE & SERVICE",
    "Amb. Dr Mark A. C. Ogbodo, Dist-FIGPCM, is identified by Lydia Memorial Hospital as its founder and Medical Director. The supplied biography describes a career spanning medicine, writing and community leadership.",
    `## A commitment to serve\n\nA native of Obi Local Government Area in Benue State, Amb. Dr Mark A. C. Ogbodo is the founder and Medical Director of Lydia Memorial Hospital; the hospital profile also identifies him as its CEO. His biography presents medicine as a responsibility to serve and describes care shaped by kindness and dignity.\n\n## Education and leadership\n\nDr Ogbodo trained as a Medical Doctor at Igbinedion University, Okada. The biography notes certification in Leadership and Management in Health from the University of Washington, Global Peace Ambassador certification and licensed Conflict Manager status through the Institute of Global Peace and Conflict Management. It also lists certificates of achievement from the British Council, Public Health England, the London School of Hygiene and Tropical Medicine, and the UK Public Health Rapid Support Team.\n\n## Author and publisher\n\nAs CEO of Adigwu Publishers, Dr Ogbodo has published *Untold* (2023), *Amour Maternel* (2021), and *The Journey — A Flight to Greatness After a Long Walk* (2017). The supplied biography describes reading-text recognition for *Untold* and *Amour Maternel* by the Nigerian Educational Research and Development Council and Benue State Ministry of Education. It also notes his work in the Chinua Achebe Poetry/Essay Anthology and *Her Rights, Our Stories*.\n\n## Professional service\n\nThe biography identifies Dr Ogbodo as the incumbent Assistant Secretary of the Association of Nigerian Private Medical Practitioners, Benue State Branch. It records prior service as Chairman of the Publication Committee and Public Relations Officer of the Nigerian Medical Association (NMA), Benue State chapter, from 2022 to 2024, and roles in NAGGMDP-Benue, the Association of Nigerian Authors, CMDA and FECAMDS.\n\n## Recognition and community involvement\n\nHonours listed in the biography include Merit Man of the Year (2025), the Global Peace Award (2025), an NMA Benue Award of Excellence (2024), the African Inspirational Faith and Leadership Impact Award (2025), and the Sixth Chinua Achebe Poetry/Essay Anthology Outstanding Entry Award (2021). It also describes church and youth service, including work as a lector, altar server and youth mentor.\n\nCredentials, publications, awards and roles on this page are presented as stated in material supplied by Lydia Memorial Hospital and have not been independently verified.`,
    40,
    "/manus-storage/lydia-founder-portrait_9d0ab916.jpg",
    "Portrait supplied as the first picture in the Lydia Memorial Hospital website script for the Our Founder section.",
  ),
];
