# TODO

- [x] Nuxt 4 SSR site builder application setup on Nitro server
- [x] Service health diagnostics endpoint (`GET /api/health`)
- [x] Template catalog and schema inspector (`GET /api/site/template`, `GET /api/site/template/:id`)
- [x] Live template HTML preview renderer (`POST /api/site/template/preview`, `GET /preview/:token`)
- [x] Site creation and JSON persistence (`POST /api/site`)
- [x] Site listing with organization filter and retrieval (`GET /api/site`, `GET /api/site/:slug`)
- [x] Site update and full replacement (`PUT /api/site/:slug`)
- [x] Site deletion endpoint (`DELETE /api/site/:slug`)
- [x] Web manifest dynamic generator (`GET /api/site/:slug/manifest`)
- [x] Curated Google fonts catalog endpoint (`GET /api/fonts`)
- [x] Notion database integration with 60-second read caching
- [x] Custom domain routing with apex canonical redirect and isolated `/sitemap.xml`
- [x] Built-in templates: `studio-v1` and `portfolio/psychiatrist`
- [x] SEO metadata generation (canonical URLs, Open Graph, Schema.org)
- [ ] Remove obsolete note in README claiming `there is no delete endpoint`
- [ ] Document `/manifest`, preview token, and fonts endpoints in README
- [ ] Dynamic template hot-reloading in production environment
