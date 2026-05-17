<!--
SYNC IMPACT REPORT
Version change: [template] → 1.0.0
Modified principles: N/A (initial population from sp.constitution.md)
Added sections:
  - Core Principles (6 principles derived from absolute coding rules)
  - Tech Stack & Architecture
  - Business Rules (Non-Negotiable)
  - Governance
Templates requiring updates:
  ✅ .specify/memory/constitution.md — updated (this file)
  ✅ .specify/templates/plan-template.md — Constitution Check gates align with principles below
  ⚠ .specify/templates/spec-template.md — review scope section against Section constraints
  ⚠ .specify/templates/tasks-template.md — verify task types cover DB migration and email tasks
Deferred items: Deployment infrastructure (Section: Tech Stack → Infrastructure) is TBD.
-->

# Deluxe Opt Service Constitution

## Core Principles

### I. Wireframe Fidelity
The file `wireframe/DeluxeOpt_Wireframe_Complete.html` is the single authoritative source
of truth for all UI layout and structure. Every page and component MUST be verified against
it before implementation begins. No layout or spacing decision may be made without reference
to this file. The wireframe includes a mobile toggle (390px viewport) and tab navigation
across all 20 pages — use both views before building.

### II. API-Only Communication
All HTTP calls from the frontend MUST route exclusively through `frontend/lib/api.ts`.
No component, hook, or utility file may directly call `fetch` or import `axios` — only
the centralized Axios instance in that file. This ensures consistent auth headers, error
handling, and base URL configuration across the application.

### III. Database Migration Discipline
Database schema MUST only be changed via Alembic migrations:
`alembic revision --autogenerate -m "description"` followed by `alembic upgrade head`.
Manual SQL schema changes are strictly forbidden. `DATABASE_URL` MUST always be read from
`backend/.env` and MUST never be hardcoded, changed, or committed to version control.

### IV. Design System Immutability
The design system — colors, typography, spacing, and button styles — is frozen and MUST NOT
be altered without explicit written approval. Tailwind CSS classes are the only accepted
styling method. Inline styles, CSS modules, and styled-components are forbidden. The
`<Image>` component from `next/image` MUST always be used; the `<img>` HTML tag is
forbidden. Heroicons SVG is the only permitted icon library; emoji are forbidden in
production UI components.

### V. Strict Type Safety
TypeScript strict mode is mandatory across all frontend code. No `any` types are permitted
anywhere. All shared TypeScript types MUST be defined in `frontend/types/index.ts` and
imported from there — no inline type declarations for shared contracts.

### VI. Background Email Processing
All transactional emails MUST be sent asynchronously via FastAPI's `BackgroundTasks`.
No email-sending operation may block the HTTP request/response cycle. All email templates
are managed via the Resend API and invoked from `backend/services/email.py`.

## Tech Stack & Architecture

### Frontend
- **Framework**: Next.js 14 (App Router), TypeScript strict mode
- **Styling**: Tailwind CSS only — no inline styles, CSS modules, or styled-components
- **State**: Zustand (`frontend/store/cartStore.ts`, `frontend/store/authStore.ts`)
- **HTTP**: Axios via `frontend/lib/api.ts` — all API calls MUST pass through this file
- **Images**: `next/image` `<Image>` component always; `<img>` tag forbidden
- **Icons**: Heroicons SVG only; emoji forbidden in production UI

### Backend
- **Framework**: FastAPI (Python)
- **ORM**: SQLAlchemy
- **Migrations**: Alembic only — no manual schema changes ever
- **Database**: Supabase (PostgreSQL)
- **File Storage**: Cloudinary (`backend/services/cloudinary.py`)
- **Email**: Resend API (`backend/services/email.py`) via BackgroundTasks
- **Auth**: JWT (access + refresh tokens, helpers in `backend/utils/auth.py`)
- **Scheduler**: APScheduler for abandoned-cart emails (`backend/services/scheduler.py`)

### Infrastructure
- **Database**: Supabase PostgreSQL
- **Storage**: Cloudinary
- **Deployment**: TODO(DEPLOYMENT): target platform not yet decided

## Business Rules (Non-Negotiable)

These rules are hard-coded logic. They MUST NOT be altered without explicit user approval
and a new spec.

### Pricing & Discounts
- Free shipping threshold: Rs. 3,000+
- EasyPaisa / JazzCash / Bank Transfer: **15% off** automatically applied
- Cash on Delivery: no discount
- Payment discount and coupon codes CAN stack

### Order ID Format
- Pattern: `DOS-YYYY-XXXX` (e.g., `DOS-2026-0042`)
- Sequential, zero-padded to 4 digits; generated server-side on order creation

### Order Status Flow
```
Placed → Processing → Shipped → Delivered
                              → Cancelled (any step except Delivered)
```

### Lens Prescription Entry
- Manual entry: dropdown controls only (SPH, CYL, Axis, ADD, PD) — no free-text fields
- Upload: photo of prescription card via Cloudinary
- Validation: show non-blocking warning if OD/OS difference is unusually large

### Payment Methods
1. Cash on Delivery — no discount
2. EasyPaisa — 15% off
3. JazzCash — 15% off
4. Bank Transfer — 15% off

## Governance

This constitution supersedes all other practices, guidelines, and conventions for the
Deluxe Opt Service project. The Six Core Principles are non-negotiable; any violation
MUST be explicitly justified and recorded in a Complexity Tracking entry in the relevant
plan.

**Amendment procedure:**
1. Raise a proposal with rationale and impact analysis.
2. Require explicit user approval before any change is applied.
3. Increment version according to semantic versioning (see below).
4. Update `LAST_AMENDED_DATE` to the amendment date.
5. Propagate changes to all dependent templates (`plan-template.md`, `spec-template.md`,
   `tasks-template.md`) and record the sync status in the Sync Impact Report.

**Versioning policy:**
- MAJOR: removal or backward-incompatible redefinition of a Core Principle
- MINOR: new principle or section added, or material guidance expansion
- PATCH: clarifications, wording fixes, non-semantic refinements

**Development compliance:**
- Verify all Six Core Principles before merging any change
- Commit format after each task: `git commit -m "[TASK-XX] description"`
- Reference `wireframe/DeluxeOpt_Wireframe_Complete.html` before building any page/component
- Follow SDD workflow: spec → plan → tasks → implementation

**Version**: 1.0.0 | **Ratified**: 2026-05-17 | **Last Amended**: 2026-05-17
