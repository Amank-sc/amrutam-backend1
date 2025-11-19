# Amrutam — Backend Architecture (2–4 pages)

## 1. Overview
Amrutam is a telemedicine backend designed for scalability, reliability, security and observability. The system exposes a REST API (Node.js + TypeScript/JavaScript) and uses PostgreSQL as the primary datastore. Redis is used for caching, distributed locks and background job queues. Services are modular and can be deployed as containers.

Goals:
- Support ~100k daily consultations
- p95 < 200ms reads, < 500ms writes
- Availability: 99.95%
- Observability: metrics, logs, traces
- Secure: encryption, MFA support, RBAC

## 2. High-level components
- **API (Express)** — request validation, authentication (JWT), RBAC, rate limiting
- **Auth service (module)** — registration, login, refresh tokens, MFA hooks
- **Doctor service (module)** — doctor profiles, availability slots
- **Booking service (module)** — booking, idempotency, distributed lock
- **Consultation service (module)** — lifecycle, notes, prescriptions
- **Analytics service (module)** — aggregated queries and metrics
- **DB: PostgreSQL** — relational storage, partitioning for hot tables
- **Cache: Redis** — caching, rate-limiting, locks, BullMQ job queues
- **Observability** — Prometheus (metrics), Grafana (dashboards), Jaeger/OpenTelemetry (distributed traces), Winston/Morgan (logs)

## 3. Data flow (high-level)
1. Client → API Gateway / Express
2. Auth middleware validates JWT and RBAC
3. For booking flows: Booking service checks availability (cache + DB), acquires distributed lock (Redis), writes booking within DB transaction, emits events to message queue (Redis stream/BullMQ)
4. Background workers process heavy tasks (emails, receipts, PDF generation)
5. Analytics service consumes events and updates aggregates or materialized views

## 4. Scalability & performance strategies
- **Horizontal scaling**: stateless API containers behind load balancer.
- **DB scaling**:
  - Read replicas for heavy read workloads.
  - Partition `consultations` table (range by date or hash by doctorId) for write/write parallelism.
  - Connection pooling (pg-pool).
- **Caching**:
  - Redis for read-heavy objects (doctor profiles, availability), TTL based.
  - Use cache-aside pattern and invalidation on updates.
- **Concurrency**:
  - Distributed locking for slot reservation (SET NX + token + Lua release).
  - Idempotency keys for write APIs to prevent double processing.
- **Asynchronous**:
  - Use BullMQ (Redis) for heavy tasks and eventual consistency workflows.
- **Observability**:
  - Metrics: request latency, error rate, queue length, db connections.
  - Traces: user request → booking flow → background job.

## 5. Tradeoffs & notes
- A single monolith can be deployed first; modularization allows later extraction into microservices.
- For 100k daily consultations, partitioning and read replicas are essential — start with one primary + 2 read replicas for reads.
- Using Redis for locks is pragmatic; consider RedLock or distributed consensus for multi-region.

