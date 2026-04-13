# Admin / CMS direction and content schema

This site is currently static HTML. For scalable updates (featured listing, headshot, leads, legal copy), use a **single source of truth** and a small publish or build step.

**Redesign admin app:** React admin source lives under [`admin/src/`](../admin/src/) and is served at **`/admin`** on the same Vite dev server as the static homepage (run `npm run dev` from the **repo root**). Supabase env vars go in **root** `.env.local`. See [`admin/README.md`](../admin/README.md).

## Recommended approach

| Option | When to use |
|--------|-------------|
| **Headless CMS** (Sanity, Contentful, Strapi) | Non-developers edit copy and media; roles, previews, and media libraries matter. Pair with a static generator (Astro, Next.js SSG) or a build that pulls JSON at build time. |
| **Supabase or Firebase + minimal admin UI** | You want full control, low monthly cost, and custom auth/workflows; you accept maintaining a small admin app and storage rules. |
| **WordPress (headless)** | Team already comfortable with WP; use REST/GraphQL to feed a static or SSR front end. |

**Pragmatic default:** **Sanity or Strapi** for structured content + **GitHub Actions** (or similar) to rebuild static HTML when content changes, or **ISR** if you move to a framework. For a **single-agent** site with few edits per month, **Supabase** (Postgres + Storage + Row Level Security) + a **password-protected `/admin`** is a reasonable middle ground.

## Minimum data model (JSON-shaped)

All fields are illustrative; extend with your branding and compliance needs.

### `siteConfig`

- `phone`, `email`, `calendlyUrl`
- `socialUrls`: `{ facebook, instagram, linkedin, youtube, ... }`
- `brokerageDisclaimer`, `idxDisclaimer`, `fairHousingCopy`
- `seo`: `{ defaultTitle, defaultDescription, ogImageUrl }`
- `primaryMarket`: string or string array (e.g. “Middle Tennessee & KY border”)

### `agent`

- `displayName`, `title`, `licenseStates`
- `headshot`: `{ url, alt }`
- `secondaryImage` (optional): `{ url, alt }`
- `bioShort`, `bioLong` (optional; rich text in CMS)

### `featuredListing`

- `active`: boolean
- `startDate`, `endDate` (ISO; hide when outside range or when `sold` is true)
- `sold`: boolean
- `address`, `price`, `specs` (beds, baths, sqft, acres, year built, etc.)
- `shortDescription` (plain or rich text)
- `primaryImage`: `{ url, alt }`
- `gallery`: array of `{ url, alt }` or folder reference in storage
- `links`: `{ propertyPageUrl, externalMlsUrl }`

### `testimonials`

- Ordered array of `{ quote, author, date, source?, featured? }`

### `faq`

- Ordered array of `{ question, answer, featured? }`

### `legal`

- `copyright`, `privacyUrl`, `termsUrl`, `idxAttribution` (required where IDX applies)

### Leads (operational)

- **Contact submissions:** `{ id, createdAt, name, email, phone?, message, sourcePage?, consent? }`
- Optional: email notification to agent, CSV export, spam scoring (e.g. honeypot + rate limit).

### Admin features worth planning (beyond listing + headshot)

- **Redirects** when a listing URL changes.
- **Open Graph / share image** per page or per listing.
- Optional **blog** or “market update” posts.
- **Roles:** `admin` vs `editor`; optional **audit log** for edits.

## Implementation sketch

1. Store documents in CMS or `site.json` in a repo.
2. **Build step** merges data into templates → static `index.html` or framework-generated pages.
3. **Featured block** becomes a partial filled from `featuredListing` + `agent.headshot` where relevant.

This keeps the public site fast and cacheable while the admin layer stays the source of truth for non-code changes.
