# Operational Patterns: retries, partitioning, caching, concurrency, transactions & DR

## Retry & Backoff
- Use exponential backoff with jitter for transient external calls.
- Example (pseudo):
  - initial=100ms, factor=2, max=5 retries, add full jitter:
    wait = random_between(0, base * 2^attempt)
- Use circuit breaker for persistent failures (opossum or custom).

## Idempotency
- Require `Idempotency-Key` header for critical writes (bookings, payments).
- Store request and corresponding response in `idempotency_records` table.
- If key seen, return stored response.

## Data Partitioning
- Partition `consultations` by range (e.g., monthly) or by hash on `doctorId`.
- Use PostgreSQL declarative partitioning:
  - Parent table `consultations`, child partitions per month or shard by doctorId.
- Archive old partitions to cold storage (S3) and remove indexes.

## Caching
- Cache doctor profiles and availability with Redis (cache-aside).
- Use short TTL (30s–5min) for availability; invalidate on change.
- Use Redis for rate-limiting (token bucket) and distributed locks.

## Concurrency handling
- Use distributed lock for slot reservation:
  - `SET key token PX ttl NX` and Lua script for safe release.
- Use database transaction with row-level `SELECT FOR UPDATE` for critical sections.

## Transactions & Sagas
- Use DB transactions for single-service multi-step ops.
- For cross-service flows (booking → payment → confirm) use SAGA:
  - Orchestrator pattern (Booking service emits events, Payment service consumes and responds).
  - Define compensating transactions (cancel booking) on failure.

## Backup & Disaster Recovery
- Postgres:
  - Enable continuous WAL archiving + point-in-time recovery (PITR).
  - Daily base backups to S3 + incremental backups.
  - Keep snapshots for 30–90 days (regulatory dependent).
- DR:
  - Cross-region read replica for warm standby
  - Run failover drill quarterly
  - Automated runbooks to promote standby and update DNS
