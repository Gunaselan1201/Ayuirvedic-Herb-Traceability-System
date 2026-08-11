# Implementation Plan — Phase-based rollout

Overview
--------
This plan breaks the work into three phases so we can safely migrate from mock-driven UIs to live blockchain-backed, production-ready portals.

Phase 1 — Critical fixes & integration (this session start)
- Create a centralized BlockchainService in each portal (`src/lib/blockchainService.*`) to replace direct fetch calls.
- Replace a small number of high-impact fetches (events) to use the new service as a proof of concept.
- Fix visible navigation/back-button issues and missing back buttons.
- Remove or gate some mock data usage in strategic pages (leave flags for fallback in case backend is down).
- Run dev servers and make sure pages load without console errors.

Phase 2 — UI/UX & accessibility
- Replace remaining mock data with live calls (page-by-page).
- Implement improved upload component (drag/drop, preview, progress) and replace inline implementations.
- Reorganize folder structure (services, components, pages). Update imports.
- Accessibility pass: ARIA, keyboard navigation, high-contrast mode, larger click targets.
- Visual polish: standardize spacing, typography, and Framer Motion transitions.

Phase 3 — Polish & QA
- Full end-to-end blockchain flow testing: create batch lab manufacturing consumer.
- Remove all mock flags and make production-ready builds.
- Run `npm run lint` and `npm run build` for both portals; ensure zero warnings/errors.
- Create `AUDIT_REPORT.md` and deployment notes (already added).

Rollback & safety
- Keep the mock-data feature gated behind `USE_MOCK=true` environment variable for hot fallback.
- Test in a staging environment before production deployment.

Deliverables for Phase 1 (concrete)
1. `src/*/lib/blockchainService.js` (Farmer) and `src/*/lib/blockchainService.ts` (Lab) — small wrapper exposing `getEvents()` and `postBatch()`.
2. A few sample pages updated to use the wrapper (Proof-of-concept): `SentForTestingList.jsx` (Farmer) and `AllBatches.tsx` (Lab).
3. Added `AUDIT_REPORT.md` and this `IMPLEMENTATION_PLAN.md` (repo root).
4. Fix back buttons on order pages.

Next steps
- I'll continue Phase 1 by creating the wrapper modules and updating the two sample pages, then start running the dev servers to validate.

-- End
