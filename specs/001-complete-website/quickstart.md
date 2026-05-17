# Quickstart: Deluxe Opt Service Development Environment

**Feature**: 001-complete-website
**Date**: 2026-05-17

---

## Prerequisites

- Python 3.11+
- Node.js 18+
- Git
- A Supabase project (PostgreSQL connection string)
- A Cloudinary account (cloud name, API key, API secret)
- A Resend account and API key

---

## 1. Clone and Branch

```bash
git clone <repo-url>
cd "Deluxe Opt Service"
git checkout 001-complete-website
```

---

## 2. Backend Setup

### Create virtual environment and install dependencies

```powershell
cd "C:\Users\Dell\Desktop\Deluxe Opt Service\backend"
python -m venv .venv
.venv\Scripts\activate
pip install fastapi uvicorn[standard] sqlalchemy alembic psycopg2-binary `
            python-jose[cryptography] passlib[bcrypt] python-multipart `
            cloudinary resend apscheduler httpx python-dotenv
pip freeze > requirements.txt
```

### Configure environment variables

Create `backend/.env`:
```env
DATABASE_URL=postgresql://postgres:<password>@<host>:<port>/<db>
SECRET_KEY=<generate-a-long-random-string>
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7
RESEND_API_KEY=re_<your-key>
CLOUDINARY_CLOUD_NAME=<your-cloud-name>
CLOUDINARY_API_KEY=<your-api-key>
CLOUDINARY_API_SECRET=<your-api-secret>
FRONTEND_URL=http://localhost:3000
```

**NEVER commit `.env` to git.**

### Run database migrations

```powershell
# After all models are created:
alembic revision --autogenerate -m "initial_schema"
alembic upgrade head
```

### Start backend dev server

```powershell
cd "C:\Users\Dell\Desktop\Deluxe Opt Service\backend"
.venv\Scripts\activate
uvicorn main:app --reload --port 8000
```

API docs available at: `http://localhost:8000/docs`

---

## 3. Frontend Setup

### Install dependencies

```powershell
cd "C:\Users\Dell\Desktop\Deluxe Opt Service\frontend"
npm install
```

**Key packages** (install if not already in package.json):
```powershell
npm install axios zustand @heroicons/react @tiptap/react @tiptap/starter-kit recharts
```

### Configure environment variables

Create `frontend/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=<your-cloud-name>
```

### Configure Tailwind and Google Fonts

In `frontend/app/layout.tsx`, add the Google Fonts `<link>` tag:
```html
<link
  href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=Outfit:wght@300;400;500;600&display=swap"
  rel="stylesheet"
/>
```

In `tailwind.config.ts`:
```ts
fontFamily: {
  cormorant: ['Cormorant Garamond', 'serif'],
  outfit: ['Outfit', 'sans-serif'],
}
```

### Start frontend dev server

```powershell
cd "C:\Users\Dell\Desktop\Deluxe Opt Service\frontend"
npm run dev
```

Site available at: `http://localhost:3000`

---

## 4. Checking the Wireframe

Before implementing any page or component, open the wireframe:

```
C:\Users\Dell\Desktop\Deluxe Opt Service\wireframe\DeluxeOpt_Wireframe_Complete.html
```

Open in a browser. Use the tab navigation to switch between pages.
Click the mobile toggle button to check the 390px mobile layout.

---

## 5. Creating New DB Migrations

Whenever you modify a SQLAlchemy model:

```powershell
cd "C:\Users\Dell\Desktop\Deluxe Opt Service\backend"
.venv\Scripts\activate
alembic revision --autogenerate -m "describe_what_changed"
alembic upgrade head
```

Never edit the database schema directly in Supabase.

---

## 6. Commit Convention

After completing each implementation task:

```bash
git commit -m "[TASK-XX] Brief description of what was built"
```

---

## 7. Development Checklist (per page/feature)

Before marking any page as complete:

- [ ] Layout matches wireframe (desktop AND mobile view)
- [ ] All Tailwind classes use design system colours (`#E8670A`, `#0F0F0F`, etc.)
- [ ] No inline styles anywhere
- [ ] All images use `<Image>` from next/image
- [ ] All API calls go through `frontend/lib/api.ts`
- [ ] TypeScript compiler reports zero errors (`tsc --noEmit`)
- [ ] Mobile view tested at 365px minimum width
- [ ] No emoji in production UI (Heroicons only)
