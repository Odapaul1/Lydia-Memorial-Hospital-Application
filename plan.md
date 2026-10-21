# Lydia Memorial Hospital: routed content, appointment requests and CMS plan

## Scope and implementation approach

Extend the existing public site rather than replacing its approved visual identity. Keep the Lydia Memorial Hospital logo, teal/sage palette, editorial serif headings, current homepage sections and current carousel; replace the founder initials with the first inline image embedded in `LydiaMemorialWebsitescript.docx`. Convert the current one-page anchors into connected pages with accessible drop-down submenus, breadcrumbs, relevant cross-links and a shared footer.

Use the current React/Vite client as a client-routed site and introduce a Node/Express application server. The site remains a static Vite build for public page assets; the container server provides the content, authentication, booking and admin APIs. In development, Vite and the API will be served through one listener on the already-configured Preview port. Production path rules will direct `/api/*` and `/auth/*` to the server, with the remaining public and admin page routes using the static SPA fallback. Preserve the existing lockfile and `pnpm@10.18.0` package manager.

The published application needs the Webdev-managed server and MySQL capabilities. Both managed capabilities are one-way enablements, and the database is shared between Preview/development and publication. Keep database migrations deterministic and additive; seed the current supplied site content only when the CMS is empty, and never overwrite later edits on restart. Do not submit test patient records to the shared database.

## Information architecture and routes

The About LMH menu will connect to an overview (`/about`), Our Story (`/about/our-story`), Vision & Mission (`/about/vision-mission`) and Our Founder (`/about/our-founder`). Each page will draw from the hospital script: location and registration, foundation/commissioning, the stated vision and mission, and the supplied founder biography, books, professional roles and recognitions. The founder portrait will use the first inline image in the supplied document, not the temporary “MO” monogram.

The Care & Services menu will connect to a services overview and dedicated pages for physiotherapy, ultrasound, laboratory, pharmacy, maternity, community medical outreaches, NHIS, immunisation, the ART unit and the infectious-disease holding-centre designation. Each page will distinguish hospital-reported information from independently verified information, state that availability and eligibility should be confirmed with LMH, and avoid inventing clinical procedures, schedules, staff, outcomes or equipment details not supplied in the brief. The existing homepage remains the main landing page; Appointment Request (`/book-appointment`) and Privacy & Data (`/privacy`) will also be linked from navigation, footers and relevant service pages. The private editor and request queue use `/admin` and its authentication routes.

The complete static page-route manifest will include the public routes, dynamic content-page patterns and admin UI routes, while excluding API endpoints and assets. Menu and footer destinations will use the same route definitions so no page is orphaned.

## Appointment requests and privacy boundary

Implement a public, mobile-friendly appointment-request form, not a live slot-booking calendar. No opening hours, staffing rota or bookable slot inventory was supplied, so a submitted request must not claim that an appointment is confirmed. Collect only the patient's name, a contact phone number, optional email, requested service, preferred date/time and consent to the privacy notice. Do not provide a free-text medical-notes field or collect symptoms, diagnosis, treatment history or other clinical details. Reject past dates and validate all values on the server. The receipt message will state that the request is pending and LMH must confirm arrangements directly; urgent matters should be handled by telephone, not the form.

Store requests in a dedicated table with a random request identifier, submitted contact/scheduling details, status and timestamps. Provide an authenticated admin queue to review and update request status. Do not claim that an email notification is sent: no customer-email provider has been configured. The admin must be able to close/archive or remove records; the public privacy notice will explain purpose and retention. Make booking submission conditional on a non-empty, administrator-reviewed data-retention statement in the CMS, so the form cannot start collecting requests while that policy detail remains a placeholder.

## Authentication, authorization and CMS

Use Manus OAuth as the sole admin login provider and implement its real callback/state validation in development, Preview and production. Protect the content editor, appointment queue and all admin APIs with the same server-side authorization; hiding the UI is not sufficient. Configure an explicit allowlist of the user's supplied Manus account email address(es) as a protected project value. Do not grant admin rights to every authenticated visitor, create a default password, or add a first-user-wins admin bootstrap. Keep auth state in secure HTTP-only cookies compatible with embedded HTTPS Preview and use origin/CSRF checks on mutating endpoints.

The CMS will let authorized admins create, edit, reorder, publish/unpublish and retire the website's public page copy and media. Editable content includes page titles and metadata, body sections, headings, links/CTA labels, hero slides, navigation/footer labels, hospital contact/address details, mission/vision, service entries, FAQs, founder biography and image/alt text, and privacy/retention copy. Use an accessible editor with formatted-text/Markdown entry and a preview of the rendered content; sanitize HTML/Markdown output. Store page revisions and editor identity so changes are attributable and recoverable. Use authenticated uploads to durable project storage for replacement media, validating type, size and ownership server-side. The platform's project-level `app.config.ts` logo metadata remains a separate project setting and is not changed by routine page editing.

Public content APIs expose only published content. Appointment APIs enforce server-side field allowlists, request size limits, a honeypot/rate limit and safe error messages. Avoid logging patient values. The admin's authorization list and OAuth/session code remain server-only; never embed platform credentials in browser output.

## Data and serving structure

Use the managed MySQL connection from `DATABASE_URL`, a committed migration history and a small SQL repository layer. Core records are CMS pages and their revisions, uploaded-media metadata, the explicit admin allowlist/mapping required for authorization, and appointment requests. Public requests can read only published pages; all content writes and all patient-request reads or status changes require an authenticated allowlisted admin.

Use a committed Dockerfile to install the pinned package toolchain, build the React client and start the Node server on the platform-supplied `PORT` (3000 by default). Keep the current static `build` declaration, add the server `deploy` declaration with an unauthenticated `/api/health` endpoint and publish path rules for the API/auth server plus static SPA fallback. Preserve the existing app logo URL and reserved platform routes.

## Project structure

- `src/app/` will own the router, route manifest mapping, data-loading and shared layout/navigation.
- `src/components/` will hold reusable header, accessible submenu, breadcrumb, CTA, service card, form field and footer components.
- `src/pages/` will contain the home, About, service, booking, privacy and admin route views.
- `src/admin/` will hold authenticated CMS and appointment-queue screens and their reusable editing controls.
- `src/lib/` will contain browser-safe API clients and shared content types/validation schemas.
- `server/` will contain the Express entry point, OAuth/cookie and allowlist authorization, API route handlers, validation, MySQL repositories/migrations and authenticated storage uploads.
- `public/manus-routes.json` will list all browser page routes; the Dockerfile and deployment declarations will serve the same client/API behavior in Preview and publication.

## Design decisions

**Design Movement:** Retain the site's calm editorial healthcare aesthetic, with a contemporary community-hospital interpretation rather than a generic clinic-dashboard redesign.

**Core Principles:** Trust through accurate hospital-supplied copy; clear route and submenu hierarchy; accessible controls at all viewport sizes; and a strict separation between public patient information and authenticated administration.

**Color Philosophy:** Continue the deep teal and blue-green foundation with restrained sage and warm neutral surfaces. Use high-contrast teal for action and navigation states, and reserve pale greens for supportive callouts rather than warnings or confirmed booking states.

**Layout Paradigm:** Keep the current spacious editorial masthead on the homepage, then use a consistent subpage frame with page title, breadcrumb, lead copy, asymmetric feature/content sections and a related-content rail. The booking form gets a focused, calm layout; admin pages get denser, utility-first panels while preserving the hospital palette.

**Signature Elements:** A slim teal guide line beside section kickers; soft sage service cards with serif headings; and small path/breadcrumb cues that connect related pages.

**Interaction Philosophy:** Menus open with click, keyboard and touch, not hover alone. All page navigation is explicit and reversible. Booking copy repeatedly describes a request rather than a confirmed slot. Editor actions show a preview and unsaved/saved state before changes are published.

**Animation:** Reuse subtle short fades only where helpful. Respect `prefers-reduced-motion`, avoid motion in booking or admin workflows, and do not autoplay subpage content.

**Typography System:** Keep DM Sans for body text, form labels, navigation and administrative tables, paired with DM Serif Display for public editorial headings. Use clear size and weight contrast for page title, section title, lead copy and metadata.

**Brand Essence:** A compassionate local hospital serving Ugbokolo and Okpokwu with care described as accessible and patient-centred; personality: grounded, reassuring and dignified.

**Brand Voice:** Warm, direct, specific and careful about source attribution. Example lines: “Tell us when you hope to visit; our team will confirm availability.” “Every page begins with information the hospital has supplied—call us if you need a current detail.”

**Wordmark & Logo:** Preserve the supplied Lydia Memorial Hospital seal and existing typographic lockup; replace the founder's initials with the actual first document image.

**Signature Brand Color:** Deep teal `#0E777B`, supported by the existing navy `#13383E` and sage.

## Approved decisions and recovery boundaries

The user approved the managed server and MySQL database, the request-only/no-clinical-notes form, and keeping submissions disabled until the hospital has approved and entered its privacy and retention statement. The user also explicitly prohibited guessing administrator emails, using real patient records in tests, instant booking, automatic confirmations, and publishing the new flow before production safeguards are verified.

The current canonical Manus `main` and deployed static version are commit `991dd31e67a7a322cd9a0127840e54e2dcf45d40`. Webdev configuration revision 2 and infrastructure inspection show both server and managed database off, no deployed route table, and no database resource. Therefore, there is no existing application database or patient data to back up before provisioning. The approved pre-change code checkpoint remains the recovery baseline; an additional named repository tag and a written backup/recovery record will be preserved before one-way feature enablement.

The platform provides no database snapshot, point-in-time recovery or full export API. Implement an authenticated export/restore mechanism for CMS content and appointment requests; store exported files only in hospital-approved protected storage, not in the public website or project assets. Test the export/restore path with an empty or synthetic fixture only. Appointment submission remains server-disabled until approved privacy/retention wording is entered, and the entire new workflow remains unpublished until a separate production-readiness and user approval gate.

Remaining user inputs are the exact Manus OAuth email address(es) to allowlist and the hospital-approved privacy/retention wording. Until addresses are provided, admin authorization must fail closed; until the policy is entered and explicitly approved, the public form must not persist a request. No appointment schedule, slot rules or instant-confirmation behavior will be invented.
