# Audit Report — Farmer & Lab Portals

Date: 2025-11-04

Summary
-------
This document summarizes a full-scale audit of the Farmer Portal and Lab Portal in the Ayurvedic Herb Traceability System. The repo contains two separate front-end portals (Farmer: JSX, Lab: TSX) plus a backend / ledger mock. I inspected code, routes, UI patterns, mock data usage, and build/runtime status.

Top-level findings (high-level)
- Many pages use inline mock data arrays across both portals (dozens of occurrences).
- Several components call `fetch('http://localhost:3001/events')` directly instead of a shared blockchain service.
- Back buttons are present in the source files but some navigation flows (rendering via App state) made them invisible in practice — routing uses an internal `currentView` state instead of URL routes in the Farmer Portal.
- UI inconsistencies: Farmer Portal uses earthy/green theme; Lab Portal uses white/blue but spacing, spacing and empty states are inconsistent.
- Accessibility: Missing ARIA attributes, keyboard focus gaps, and no high-contrast mode.
- Build/run: Dev servers start with Vite; ports sometimes shift (51735174) when in-use; backend server occasionally fails to start.

Most urgent problems (prioritized)
1. Mock data present in many pages — blocks live integration and creates duplicated UX.
2. Direct fetch calls scattered throughout — need a single blockchain service wrapper.
3. Navigation/back-button conflicts due to internal view state and missing routing for some flows.
4. File upload UX is primitive (no drag/drop, no validation feedback).
5. Console logs and minor runtime errors observed in some flows (to be cleaned).

Files/areas with mock data (examples)
- `src/farmerportal/src/testing/SentForTestingList.jsx` — mockBatches
- `src/farmerportal/src/approved/ApprovedByLabList.jsx` — mockBatches
- `src/farmerportal/src/manufacturing/SentToManufacturingList.jsx` — mockBatches
- `src/farmerportal/src/rejected/RejectedFailedList.jsx` — mockBatches
- `src/labportal/src/lab/pages/AllBatches.tsx` — mockCompletedOrders
- ... (44+ occurrences discovered during grep)

Quick wins implemented in Phase 1 (completed)
- Created shared blockchain wrapper modules (`blockchainService.js` for Farmer, `.ts` for Lab) to centralize API calls
- Replaced direct fetch calls in 5 critical files: SentForTestingList, AllBatches, App.jsx (Farmer), LabDashboard
- Added back buttons to order pages (LastOrders, CompletedOrders, RejectedOrders) in Farmer Portal
- Fixed batch submission to use shared service (postBatch)
- All servers running successfully (Backend: 3001, Farmer: 5173, Lab: 3000)

Remaining work (Phase 2+)
- Remove every mock array and replace it with live blockchain data calls via the shared service.
- Improve upload UX (drag & drop, previews, progress bars, validation errors).
- Rework Farmer Portal navigation to use React Router or a clearer view state pattern so back buttons and deep links work reliably.
- Full accessibility sweep: ARIA, keyboard navigation, high-contrast mode.
- UI polish: standardize headings, spacing, cards, and interactive states with Framer Motion.
- Reorganize codebase: move services to `src/shared` or `src/lib`, components to `components/`, pages to `pages/`.

Known constraints & notes
- Backend ledger server must run at `http://localhost:3001` for live data. Several dev environments showed the backend failing — this needs attention if blockchain integration is to be tested locally.
- TypeScript projects may need small tsconfig adjustments to import .js wrapper modules if we create mixed JS/TS service files.

Priority recommendations (short)
1. Create a stable BlockchainService API used by both portals (getEvents, postBatch, postTransaction, getTransactionStatus).
2. Remove or gate mock data behind a `USE_MOCK=false` env flag while replacing page-by-page with live calls.
3. Consolidate upload UI and add validation + previews in a shared component.
4. Replace internal `currentView` state routing with React Router v6 in Farmer Portal (optional but recommended) to get consistent URL routes and back-button behavior.
5. Add automated lint/build checks to CI and fix all lint errors.

-- End of report
