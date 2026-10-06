# CLAUDE.md

Medicine catalog: Spring Boot microservices + React. **Full context is in
[docs/PROJECT_GUIDE.md](docs/PROJECT_GUIDE.md). Read it first** and update its Status / Known issues
sections when work changes them.

## Layout
- `api-gateway/` (:8080): Spring Cloud Gateway. Routes `/api/auth/**` → user-service and
  `/api/medicines/**` → medicine-service. Config only (`application.yml`). No auth checks.
- `user-service/` (:8081): OTP login (dev OTP `123456`), issues JWT (`sub`=mobile, `role` claim).
  Seeds owner `1234567890`.
- `medicine-service/` (:8082): CRUD. GET is public. POST/PUT/DELETE need `ROLE_OWNER`.
  `quantity` is hidden from non-owners.
- `frontend/` (:5173): React 18 + Vite + MUI + i18next. API calls go only in `src/api/medicineApi.js`,
  UI text only in `src/i18n/locales/en.json`.
- One shared Postgres DB `medicine_db`. Schema comes from Hibernate `ddl-auto=update`.
  `JWT_SECRET` must match in both services.

## Commands
- Backend service: `cd <service> && mvn spring-boot:run` (start order: user → medicine → gateway)
- Frontend: `cd frontend && npm install && npm run dev`, build with `npm run build`
- No tests exist yet.

## Gotchas
- README.md is double-encoded UTF-16. Don't trust editor rendering. Decode or rewrite as UTF-8.
- Windows machine. docker/psql are not on PATH.
