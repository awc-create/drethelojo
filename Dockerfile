# syntax=docker/dockerfile:1

# ============================
# deps: install deps
# ============================
FROM node:22-alpine AS deps
WORKDIR /app

RUN apk add --no-cache libc6-compat && corepack enable

COPY package.json ./
COPY yarn.lock* pnpm-lock.yaml* package-lock.json* ./

RUN \
  if [ -f yarn.lock ]; then \
    yarn install --immutable; \
  elif [ -f pnpm-lock.yaml ]; then \
    corepack pnpm install --frozen-lockfile; \
  elif [ -f package-lock.json ]; then \
    npm ci; \
  else \
    echo "No lockfile found; aborting for reproducibility." && exit 1; \
  fi

# ============================
# builder: next build
# ============================
FROM node:22-alpine AS builder
WORKDIR /app

ENV NEXT_TELEMETRY_DISABLED=1

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN \
  if [ -f yarn.lock ]; then \
    yarn build; \
  elif [ -f pnpm-lock.yaml ]; then \
    corepack pnpm build; \
  else \
    npm run build; \
  fi

# Fail early if standalone wasn't produced
RUN node -e "const fs=require('fs'); if(!fs.existsSync('.next/standalone/server.js')){console.error('\\n❌ Missing .next/standalone/server.js. Ensure output:\"standalone\" in next.config.*'); process.exit(1)}"

# ============================
# runner: minimal prod image
# ============================
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production \
    PORT=3000 \
    HOSTNAME=0.0.0.0

RUN apk add --no-cache libc6-compat \
 && addgroup -g 1001 -S nodejs \
 && adduser -S nextjs -u 1001

# Standalone server + static assets
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

USER 1001
EXPOSE 3000

CMD ["node", "server.js"]
