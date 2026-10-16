# Shared RSVP and review storage

The website uses Supabase through `app/api/wedding-feedback/route.ts`. Run [`schema.sql`](./schema.sql) in the Supabase SQL Editor. This also adds the persistent `guest_messages` table; rerun it after updating the site so existing projects receive that table. Then set these server-only environment variables in Vercel (and in `.env.local` for local development):

```text
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

Do not prefix the service role key with `NEXT_PUBLIC_`. It bypasses row-level security and must stay server-side. The API uses a stable anonymous browser ID as the primary key, so repeat submissions from that browser update its existing response. Different browsers or devices count as separate guests because the current RSVP form has no guest identity/login.

Rating votes and written reviews are stored separately. A visitor can submit one written review per browser ID; a later submission updates that review rather than inflating the count. Reviews are loaded 50 at a time in the expandable **Read Website Reviews** section. Its displayed total uses an exact database count and the visitor can continue loading pages; there is no 100 or 500 record application limit.

The RSVP form records one response per browser ID, so each saved RSVP currently counts as one person. A later change from attending to not attending updates that same row. Rating choices also update one row per browser ID. Website reviews are one per browser ID. Guest prayers and messages are stored as separate persistent entries and are shared with all visitors. Reviews and guest messages load 50 at a time with a control to continue loading the full list. The API validates each submission, uses the server-only service role key, and the schema revokes direct table access from the public `anon` and `authenticated` roles.

After applying the schema, add `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` to the Vercel project’s environment variables for each deployment environment that should use the database, then redeploy through the normal Vercel workflow. The app reports a save error until the database and credentials are reachable; it never counts a failed request as saved.

The previous implementation stored RSVP and rating totals in each visitor's local storage, and guest prayers in browser-local storage. Those browser-specific records cannot be safely merged into shared individual responses or messages. The shared database starts with submissions made after configuration; existing browser storage values are left untouched.
