# Amrutam Backend Security Checklist

1. **Authentication**
   - JWT-based auth for all protected routes
   - RBAC for roles (user, doctor, admin)

2. **Password Security**
   - Bcrypt hashing
   - No plain-text passwords stored

3. **Data Validation**
   - Validate all inputs (email, dates, IDs)
   - Prevent SQL injection

4. **Transport Security**
   - HTTPS in production

5. **Observability**
   - Winston + Morgan logging
   - Prometheus metrics

6. **Database Integrity**
   - Foreign key constraints
   - Sequelize transactions to prevent partial inserts

7. **Secrets Management**
   - Store JWT_SECRET, DB credentials in `.env`
   - Do NOT commit `.env` to GitHub

8. **Rate Limiting**
   - Prevent brute-force attacks on login/register

9. **Audit Logs**
   - Store user activity logs for compliance
