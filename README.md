## BusinessOS Monorepo

BusinessOS is a cloud-based, multi-tenant Business Management Platform (CRM + Accounting + Inventory + HR/Payroll).

### Structure

- `apps/api`: TypeScript/Express backend (PostgreSQL, Sequelize, JWT, RBAC, multi-tenancy)
- `apps/web`: Frontend (to be added in a later phase)

### Quickstart (Dev)

1. Copy env and adjust values:
   - `cp .env.example .env`
2. Start dependencies and API:
   - `docker compose up -d --build`
3. API runs at `http://localhost:4000`.

### Seeding Demo Blueprint

- Run with SQLite locally:
  - `BLUEPRINT_CODE=bc-56eba2cc-81e8-46bf-a37d-db943ddca5a7 DB_DIALECT=sqlite SQLITE_STORAGE=./data/dev.sqlite npm --workspace apps/api run seed:blueprint`
- Demo login after seeding:
  - Email: `owner@demo.local`
  - Password: `demo1234`

### Tech

- Node.js (TypeScript, Express)
- PostgreSQL
- Sequelize ORM
- JWT Auth, RBAC Middleware
- Multi-tenancy via `tenant_id` scoping

### Phases

### Production Build & Deploy (API)

- Build container:
  - `docker build -f apps/api/Dockerfile.prod -t businessos-api:prod ./apps/api`
- Run:
  - `docker run -e NODE_ENV=production -e DATABASE_URL=postgres://... -e JWT_SECRET=... -p 4000:4000 businessos-api:prod`


- Phase 1: Auth, Tenants, Users, Customers, Quotes, Invoices (single tenant)
- Phase 2: True multi-tenancy, Chart of Accounts, Transactions, Basic Reports
- Phase 3: Inventory, Purchase, HR/Payroll, Deep Integrations
- Phase 4: Mobile, Advanced Analytics, Bank Integrations

- 👋 Hi, I’m @aspireuser001
- 👀 I’m interested in ...
- 🌱 I’m currently learning ...
- 💞️ I’m looking to collaborate on ...
- 📫 How to reach me ...
- 😄 Pronouns: ...
- ⚡ Fun fact: ...

<!---
aspireuser001/aspireuser001 is a ✨ special ✨ repository because its `README.md` (this file) appears on your GitHub profile.
You can click the Preview link to take a look at your changes.
--->
