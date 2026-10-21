# Lydia Memorial Hospital website: backup and recovery record

**Status:** Pre-provisioning record, 21 October 2026. This plan must be updated after the managed database is provisioned and before the appointment form is enabled.

## Existing recovery baseline

The public site is currently deployed from the Manus-managed canonical repository at commit `991dd31e67a7a322cd9a0127840e54e2dcf45d40`. The same commit is the current `origin/main` tip. It contains the static public website and is the known-good code version before the CMS, booking, server and database work. A repository tag named `pre-db-enable-20261021` will preserve that exact commit before one-way service enablement. The supplied GitHub repository is not the project remote and will not receive project changes.

The current Webdev configuration is revision 2, with `features.server=false`, `features.database=false` and `publishing.auto_publish=false`. The infrastructure report confirms no server or database is provisioned and no published route table exists. Thus there is no existing application database, patient record, schema or database backup to preserve before provisioning; the managed database, once enabled, starts as a new empty resource. The present site continues to run at the existing deployed version while the new implementation is built.

## Recovery limits

Webdev's managed database currently exposes no separate snapshot, point-in-time recovery, production-to-development copy or full asynchronous backup/export API. Server/database feature enablement is one-way. Git checkpoints protect application source and configuration history; they do not back up MySQL records. A code rollback does not restore database content.

No real patient information will be used in tests. Since development and production share one database, no test submission or test deletion will be performed against that database. Before privacy/retention policy approval, the public booking API will reject submissions server-side even if someone bypasses the disabled UI.

## Recovery controls to implement before accepting real requests

The CMS will keep recoverable revisions of editable public content. An authenticated backup/export action will download a versioned JSON archive containing CMS pages, content revisions, media metadata and appointment requests, but excluding OAuth tokens, secrets, cookies and allowlist credentials. Export files will be sent directly to the authorized administrator's browser; they will not be placed in public storage, application logs or the public asset tree. Hospital staff must save each download in their own approved, protected backup location.

A matching restore workflow will validate the archive schema and checksum, show the record counts and changes before applying anything, require explicit administrator confirmation, and merge records by stable identifiers. It will not silently erase rows or overwrite current data. Recovery from a prior export will be tested only using an empty database or synthetic fixture before a production booking workflow is approved. Before any future schema change that could alter existing data, staff must first export a fresh backup; migrations will otherwise be additive and tracked in a migration table.

For application-code recovery, use the named `pre-db-enable-20261021` tag and the immutable canonical history. If a new code release is defective, restore source from the last known-good commit through a normal forward commit/checkpoint; do not rewrite or force-push `main`. Publish/rollback is a separate operation, and no new patient-request implementation will be published until the owner verifies safeguards and explicitly approves the production transition.

## Pre-enable sequence

1. Verify the code baseline and named repository tag point to `991dd31e67a7a322cd9a0127840e54e2dcf45d40` on the Manus-managed remote.
2. Keep appointment intake disabled by default and ensure admin authorization is deny-by-default until the user supplies the exact Manus OAuth email allowlist.
3. Enable the one-way server/database capabilities only after this record and the code recovery point are saved.
4. Build migrations and content seeding so they are versioned, additive, idempotent and never overwrite later edits.
5. Implement and verify authenticated content/request exports and a non-destructive restore preview with empty/synthetic data only.
6. Before going live, review admin authorization, cookie/CSRF protections, server-side form gating, privacy/retention content, backups, migrations, production routes and health readiness with the user. The submission form remains disabled until the hospital-approved privacy statement and retention policy are entered and accepted.
