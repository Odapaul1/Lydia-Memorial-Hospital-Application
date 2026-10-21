# TODO

## Reference-inspired homepage additions
- [x] Keep the current Lydia Memorial Hospital hero content and supplied exterior as the first slide; add further pictures contained in the attached Endoville ZIP as additional Lydia Memorial Hospital hero slides, so the hero is a working slider.
- [x] Keep parts of the current Lydia Memorial Hospital website that are already similar to the reference, repurpose other parts, and add missing suitable homepage parts and pictures from the reference.
- [x] Preserve Lydia Memorial Hospital's identity and source-supported content; do not copy Endoville branding or introduce unsupported doctors, statistics, services, outcomes, events, or testimonials.
- [x] Clearly identify Endoville-reference images as illustrative and not actual Lydia Memorial Hospital photos; provide useful accessible image descriptions and responsive controls.
- [x] Add useful visitor-information FAQs that use only facts provided by Lydia Memorial Hospital and direct visitors to the hospital to confirm current availability and details.

## Hospital identity and responsive homepage
- [x] Build a complete, responsive public-facing website for Lydia Memorial Hospital (LMH) following the structure, layout and visitor experience of the supplied hospital-site reference while replacing its identity and content with LMH branding and hospital-supplied details.
- [x] Present LMH as patient-centred, compassionate and therapeutically calm; use the motto “Gifted Hands.”
- [x] The homepage provides concise introductions to the hospital’s purpose and currently stated services, and prominent clickable phone and email actions.
- [x] Include accessible navigation, readable content hierarchy, mobile-friendly layouts, semantic page structure, keyboard-friendly navigation and controls, visible focus states, descriptive link labels, suitable contrast and responsiveness across common screen sizes.

## About Lydia Memorial Hospital
- [x] Present LMH as located at No. 3 Ejeh Street, Ichakwu-Amejo (Ugbokolo), Edumoga, Okpokwu Local Government Area, Benue State, Nigeria.
- [x] State the hospital was founded and commissioned on 6 June 2022 by Distinguished Senator Abba Moro and show registration number 3734742.
- [x] Identify Amb. Dr Mark A. C. Ogbodo, Dist-FIGPCM, as founder and Medical Director, and Dr Mark A. C. Ogbodo as CEO.
- [x] Include the hospital’s vision of ensuring complete patient wellbeing and promoting healthy medical practices, and its mission to provide affordable, easily accessible excellent healthcare through God's Gifted hands.

## Care and services
- [x] Present only source-supported capabilities: physiotherapy, ultrasound, equipped laboratory, pharmacy, maternity, community medical outreaches, NHIA-accredited NHIS services (August 2025), approved immunisation services, ART unit and the Benue State Government designation as an infectious-disease holding centre in early 2025.
- [x] Do not invent treatments, availability, opening hours, doctors, outcomes, or other unsupported claims.
- [x] Present statements from LydiaMemorialWebsitescript.docx as hospital-supplied information and do not imply independent verification.

## Founder profile and contact
- [x] Include the supplied biography of Amb. Dr Mark A. C. Ogbodo, Dist-FIGPCM, covering medical training at Igbinedion University; leadership and peace credentials; author and publisher work; named books; professional service; and notable awards.
- [x] Include a contact and location section with No. 3 Ejeh Street, Ichakwu-Amejo (Ugbokolo), Edumoga, Okpokwu Local Government Area, Benue State, Nigeria; clickable +234 807 569 7064 and lydiamemorialhospital@gmail.com actions.

## Connected About LMH and Care & Services pages
- [ ] Keep the existing Lydia Memorial Hospital site identity and content that already matches; repurpose other sections as appropriate and add the missing connected pages and submenus for “About LMH” and “Care & Services.”
- [ ] Provide rich, source-grounded content on each page; link pages through accessible menus, breadcrumbs, footer links and related-content links so visitors can move between them.
- [ ] Use the first picture embedded in `LydiaMemorialWebsitescript.docx` in the “Our Founder” section instead of the “MO” initials/monogram.
- [ ] Do not invent hospital contact details, staff, appointment hours, service availability, clinical claims, or other facts not supplied or approved by Lydia Memorial Hospital.

## Private content management
- [ ] Provide authorized hospital staff with a private Manus OAuth-protected CMS to edit the public site's headings, body content, service pages, navigation labels, links/CTAs, hero slides, founder content and image, FAQs, contact/location information, and privacy/retention text; allow adding, editing, reordering, publishing/unpublishing and retiring content and media.
- [ ] Provide an authenticated, private dashboard for authorized staff to review and update appointment-request status. Only explicitly authorized staff may access the CMS, request details or admin APIs.
- [ ] Ask the user for authorized Manus OAuth email address(es) before granting access. Do not guess, fabricate or default-grant any admin email or allow access to every authenticated visitor.

## Appointment request flow and patient-data restrictions
- [ ] Use a request-only form. Patients may submit their name, phone number, optional email, requested service and preferred date/time. Do not collect symptoms, diagnoses or clinical notes.
- [ ] State clearly that submitting a request does not confirm an appointment; hospital staff must contact the patient to confirm availability. Do not implement instant booking, automatic confirmation or unsupported booking hours/availability rules.
- [ ] Keep appointment submissions disabled until the hospital has approved and entered its privacy statement and data-retention policy in the CMS. Do not collect real patient information before both are present and approved.
- [ ] Do not use real patient data for development, testing, demonstrations or acceptance checks. Development/Preview and production share the same managed database, so test writes would affect the live data.

## Managed services, backup and production safeguards
- [x] Before enabling the managed server and MySQL database, record a recoverable Manus-project code checkpoint and document a database backup/recovery plan; confirm and disclose if there is no existing database or data to back up. The existing deployed/canonical baseline is `991dd31e67a7a322cd9a0127840e54e2dcf45d40`, protected by remote tag `pre-db-enable-20261021`; database provisioning was off and no application records existed.
- [x] Use the managed server and database only after the approved backup/recovery plan is in place. Treat server/database enablement as one-way and explain any risk or irreversible change before proceeding. User approval was obtained, the recovery documents and checkpoint were saved, and config revision 3 reports both capabilities enabled.
- [ ] Use safe migrations that preserve patient records; keep confidential request data out of logs, client bundles and public content endpoints.
- [ ] Before any future public launch of appointment submission, verify server-side authorization, request-data protections, the approved privacy/retention text, backup/export and recovery safeguards, production serving configuration and health/readiness behavior. Do not publish the new patient-data flow until the user approves going live.
