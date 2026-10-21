/**
 * Editorial content for the page types that the CMS does not yet model:
 * news articles, accepted plans and careers vacancies.
 *
 * Everything here is presented as information supplied by Lydia Memorial
 * Hospital; patients are asked to confirm current details with the hospital.
 * When these content types are added to the CMS, this module can be replaced
 * by the API payload without changing the pages that read it.
 */

export interface NewsItem {
  slug: string;
  category: string;
  /** ISO date, e.g. "2025-08-14". */
  date: string;
  title: string;
  excerpt: string;
  image: string;
  /** Paragraphs separated by a blank line. */
  content: string;
}

export const NEWS_MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** "2025-08-14" → "14 Aug 2025". */
export const formatNewsDate = (iso: string): string => {
  const [year, month, day] = iso.slice(0, 10).split("-");
  const index = Number(month) - 1;
  if (!year || !day || index < 0 || index > 11) return iso;
  return `${day} ${NEWS_MONTHS[index]} ${year}`;
};

export const newsItems: NewsItem[] = [
  {
    slug: "nhis-accreditation-reported",
    category: "Hospital news",
    date: "2025-08-14",
    title: "NHIS accreditation reported for Lydia Memorial Hospital",
    excerpt:
      "Information supplied by the hospital states that NHIA accreditation for NHIS services was received in August 2025.",
    image: "/images/news-1.jpg",
    content: `The information supplied by Lydia Memorial Hospital states that the hospital received NHIA accreditation to provide NHIS services in August 2025.

Accreditation is a step that allows a hospital to be considered by patients who hold NHIS cover. It does not by itself confirm which treatments, departments or conditions are currently covered.

Please contact the hospital directly to confirm current eligibility, the services available under your plan, and any documentation you should bring to your visit.`,
  },
  {
    slug: "infectious-disease-holding-centre",
    category: "Public health",
    date: "2025-02-03",
    title: "Benue State designation as an infectious-disease holding centre",
    excerpt:
      "The hospital profile reports a Benue State Government designation received in early 2025.",
    image: "/images/news-2.jpg",
    content: `According to the hospital's supplied profile, the Benue State Government designated Lydia Memorial Hospital as a holding centre for infectious diseases in early 2025.

A holding centre supports the safe reception and stabilisation of patients while further care is arranged. The profile does not describe current capacity, admission criteria or the specific conditions handled.

For any question about admissions or referrals, please speak with the hospital team directly.`,
  },
  {
    slug: "community-medical-outreaches",
    category: "Community",
    date: "2024-11-18",
    title: "Medical outreaches across Okpokwu and beyond",
    excerpt:
      "The hospital profile says LMH has provided several medical outreaches to its community since it opened.",
    image: "/images/news-3.jpg",
    content: `The information supplied by the hospital says that, since its inception, Lydia Memorial Hospital has carried out several medical outreaches to the community and beyond.

Outreach work brings basic checks, advice and treatment to people who may not easily reach a hospital. The hospital's profile does not give dates, locations or the number of people seen.

If you would like to know about upcoming outreach activity in your area, please contact the hospital.`,
  },
  {
    slug: "prepare-for-your-first-visit",
    category: "Patient guidance",
    date: "2025-06-02",
    title: "Preparing for your first visit",
    excerpt: "A short checklist to help you arrive feeling ready and make the most of your appointment.",
    image: "/images/howtoprepare.jpg",
    content: `Arriving prepared makes a visit easier for you and for the clinical team.

Bring any current medication, your hospital or insurance details if you have them, and a written note of the questions you would like to ask. If a previous test or scan is relevant, bring the report with you.

It is also worth calling ahead to confirm opening times, the cost of the service you need and whether an appointment is required that day.`,
  },
  {
    slug: "maternity-care-what-to-expect",
    category: "Care & services",
    date: "2025-09-18",
    title: "Maternity care: what to expect when you contact us",
    excerpt:
      "Maternity is listed among the hospital's services. Here is how to find out what is available for you.",
    image: "/images/service-womens.jpg",
    content: `Maternity is listed among the services described in the hospital's supplied profile.

The profile does not set out a detailed maternity schedule, so the most reliable next step is a conversation with the hospital. The team can explain what is currently available, how antenatal visits are arranged and what you should bring.

Lydia Memorial Hospital's stated mission is to provide affordable, easily accessible excellent healthcare through God's Gifted hands.`,
  },
];

export interface PlanOption {
  name: string;
  mark: string;
  note: string;
}

export const planOptions: PlanOption[] = [
  { name: "NHIS", mark: "N", note: "Accreditation for NHIS services reported by the hospital in August 2025." },
  { name: "Private HMO cover", mark: "H", note: "Ask the hospital which HMOs are currently contracted." },
  { name: "Corporate & staff schemes", mark: "C", note: "Arrangements for employers and staff groups." },
  { name: "Self-paying patients", mark: "S", note: "Ask for an estimate before your visit." },
];

export interface CareerRole {
  group: "Clinical" | "Support";
  title: string;
  meta: string;
}

export const careerRoles: CareerRole[] = [
  { group: "Clinical", title: "Staff Nurse · Maternity", meta: "Ugbokolo, Benue State · Full time" },
  { group: "Clinical", title: "Medical Officer · General Practice", meta: "Ugbokolo, Benue State · Full time" },
  { group: "Clinical", title: "Physiotherapist", meta: "Ugbokolo, Benue State · Full time" },
  { group: "Support", title: "Laboratory Scientist", meta: "Ugbokolo, Benue State · Full time" },
  { group: "Support", title: "Patient Experience Coordinator", meta: "Ugbokolo, Benue State · Full time" },
];
