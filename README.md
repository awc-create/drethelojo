
## 🗃️ Database / Prisma

Start Postgres and apply schema:

```bash
docker compose up -d
npx prisma migrate dev --name init
npx prisma generate
```

Default connection (auto-generated):

```
DATABASE_URL="postgresql://admin:admin@localhost:6432/drethelojo?pgbouncer=true&connection_limit=1&connect_timeout=5"
DIRECT_DATABASE_URL="postgresql://admin:admin@localhost:5432/drethelojo?connect_timeout=5"
```
