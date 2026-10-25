# MWap

A stateless, template-driven site builder. Pick a template, send a brand and a payload, get a server-rendered website with SEO built in (sitemap, canonical URLs, Schema.org, Open Graph). Built with Nuxt 4 (SSR on Nitro), Tailwind and Bun, and deployed as one Docker image.

## How it works

- A **template** (currently `studio-v1`) defines a payload schema, a sample payload and the Vue components that render it. Missing payload fields are filled from the template's `sample`, a complete payload that `GET /api/site/template/:id` also returns for prefilling an editor.
- A **site** is `{ slug, orgId, templateId, brand, data, domains, updatedAt }`. The brand (name, logo, favicon, font, five colors) is shared by every template.
- Sites are served at `/<slug>`, `/<slug>/projects`, `/<slug>/about`, or at the root of a custom domain.
- Every site belongs to one **organization** (`orgId`, a lowercase slug); one organization can own many sites. Slugs are unique across all organizations, reads are public, and a site without an organization belongs to `default`.
- The zod schemas in `shared/utils` are the runtime source of truth.

### Where sites come from

In order of precedence:

1. Sites saved through the API (`POST`/`PUT`), stored as JSON files in `NUXT_PRIVATE_SITES_DIR`.
2. Published rows of a Notion database (read-only, cached for 60 seconds).
3. The built-in example site `northlight-studio`.

### Notion database

One row per site, with these properties: `Slug` (title), `Template` (select), `Domains` (multi-select, or comma-separated text), `Organization` (relation to a page in your workspace; the page title, slugified, is the `orgId`, and a row without one is `default`) and `Published` (checkbox). The brand and payload are JSON in the code block(s) of the row's page:

```json
{
  "brand": {
    "name": "...",
    "logoUrl": "...",
    "faviconUrl": "...",
    "fontFamily": "Oxanium",
    "colors": { "primary": "#fb3737", "secondary": "#262626", "accent": "#f24067", "background": "#171717", "text": "#f8fafc" }
  },
  "data": { "pages": { "home": { "title": "..." } } }
}
```

Rows that fail validation are skipped and logged. If Notion is unreachable the last good copy is served; with nothing cached, reads of Notion sites answer 503.

### Custom domains

A site can list `domains` (lowercase apex hostnames). A request whose `Host` matches one is served at the domain root (`/projects` instead of `/<slug>/projects`). `www.<domain>` and `/<slug>/...` redirect (301) to the clean URL, and `/sitemap.xml` lists only that site. Any other host keeps the `/<slug>` routes. Your reverse proxy must pass `x-forwarded-host` and `x-forwarded-proto`, and overwrite them if the client sent its own.

## API

The contract lives in the Postman collection `postman/collections/MWap RESTful API` (requests, examples and assertions).

| Method | Path                                           | Notes                                              |
| ------ | ---------------------------------------------- | -------------------------------------------------- |
| GET    | `/api/health`                                  | liveness                                           |
| GET    | `/api/site/template`, `/api/site/template/:id` | template catalog, schema and placeholders          |
| POST   | `/api/site/template/preview`                   | validate a payload and get rendered HTML           |
| GET    | `/api/site`, `/api/site/:slug`                 | list (paginated, optional `?org=` filter) and read |
| POST   | `/api/site`                                    | create, needs `x-api-key` and `x-org-id`           |
| PUT    | `/api/site/:slug`                              | replace, needs `x-api-key` and `x-org-id`          |

Validation failures answer 400 with `data.errors[{ field, message, code }]`; a missing or malformed `x-org-id` is reported with `field: "x-org-id"`. Replacing a site that belongs to another organization answers 404, like an unknown slug, so slugs of other organizations are not revealed.

## Configuration

| Variable                                           | Purpose                                                                  |
| -------------------------------------------------- | ------------------------------------------------------------------------ |
| `NUXT_PUBLIC_SITE_URL`                             | public URL of the service (canonical URLs, sitemap)                      |
| `NUXT_PRIVATE_API_KEY`                             | key for write endpoints; unset means every write is 401                  |
| `NUXT_PRIVATE_SITES_DIR`                           | where saved sites are stored, default `./data/sites`                     |
| `NOTION_API_KEY`, `NUXT_PRIVATE_SITE_NOTION_DB_ID` | enable the Notion source (integration token, and the id of the database) |

See `.env.example`.

## Run

```bash
bun install
bun run dev
```

Production build (Node 22.11+ or 24 is required for `nuxt build`):

```bash
bun run build
node .output/server/index.mjs
```

Docker (the sites volume must be kept between runs):

```bash
docker build -t mwap .
docker run -p 3000:3000 -v mwap-data:/app/data -e NUXT_PRIVATE_API_KEY=changeme -e NUXT_PUBLIC_SITE_URL=http://localhost:3000 mwap
```

## Test the API

With the service running on `localhost:3000`:

```bash
postman collection lint "postman/collections/MWap RESTful API"
postman collection run "postman/collections/MWap RESTful API" -e postman/environments/Local.environment.yaml --env-var apiKey=changeme
```

Each run creates one test site (there is no delete endpoint), so use a throwaway `NUXT_PRIVATE_SITES_DIR`.

## License

MIT
