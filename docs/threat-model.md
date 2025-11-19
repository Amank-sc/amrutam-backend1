# Threat model & Security Checklist

## 1. Summary
This document lists potential threats, mitigation strategies and a security checklist aligned with OWASP best practices for Amrutam telemedicine backend.

## 2. Data classification
- **Public**: non-sensitive public information
- **PII**: user name, email, contact
- **PHI**: medical notes, prescriptions (treat as highly sensitive)
- **Financial**: payments

PHI and financial data must be encrypted at rest and transit and have stricter access/audit.

## 3. Attack surface
- Public REST API endpoints
- Admin console / dashboards
- Database & backups
- Storage buckets (prescription/pdf)
- Background workers
- Third-party integrations (payment, email, SMS)

## 4. Threats & mitigations (high level)
- **Broken Authentication**: enforce strong password policies, hashed passwords (bcrypt), refresh tokens, MFA for admin/privileged roles.
- **Broken Access Control**: RBAC, validate server-side on every request.
- **Injection**: use parameterized queries / ORM (Sequelize / Prisma), input validation (Zod/ajv).
- **Sensitive Data Exposure**: TLS everywhere, encryption at rest for DB & S3, minimal data retention.
- **Misconfiguration**: use environment-specific configs, secrets manager, not storing secrets in repo.
- **Insufficient Logging & Monitoring**: structured logs (JSON), centralized logs, Prometheus alerts for error spikes.
- **Dependency Risks**: GitHub Dependabot + Snyk/OWASP dependency scanning in CI.

## 5. Security checklist (practical)
- [x] Passwords hashed with bcrypt
- [x] JWTs issued with short expiry & refresh tokens
- [x] RBAC middleware for protected routes
- [x] Input validation on all endpoints
- [x] Rate limiting (Redis) on auth endpoints
- [x] TLS in production, HSTS
- [x] Secrets in env or secret manager (do not commit `.env`)
- [x] Audit logs stored append-only for sensitive actions
- [x] Dependency scanning in CI (Snyk/dependabot)
- [x] Regular backups + automated restore drills

## 6. Key rotation & secrets lifecycle
- Use KMS (AWS/GCP) for production keys.
- Rotate JWT signing keys quarterly or on compromise.
- Use short lived credentials for cloud infra.

## 7. Incident response & logging
- Errors and auth failures generate alerts.
- Retain audit logs for compliance (90–365 days depending on policy).
