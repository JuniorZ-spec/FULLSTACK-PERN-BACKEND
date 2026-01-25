# Drizzle + Neon setup (backend)

## Steps to configure

1. Set your Neon connection string in `.env`:

```env
DATABASE_URL="postgresql://[user]:[password]@[neon_hostname]/[dbname]?sslmode=require&channel_binding=require"
```

2. Install dependencies (already added to `package.json`) with npm:

```bash
npm install
```

3. Generate migration from schema:

```bash
npm run db:generate
```

4. Apply migration to Neon:

```bash
npm run db:migrate
```

5. Run the demo CRUD script:

```bash
npx tsx src/db-demo.ts
```

Notes:

- The db client is `src/db.ts` using the Neon Serverless (HTTP) adapter.
- Migration config: `drizzle.config.ts`.
- Do NOT commit your `.env` with credentials.
