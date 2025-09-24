# stage 1: Builder
FROM  node:20-alpine AS builder

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Copy package file and install dependencies
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile 

# Copy the rest of the a    pplication code
COPY . .
COPY prisma ./prisma/

# Generate Prisma client
RUN npx prisma generate

# Build the application
RUN pnpm run build

# stage 2: Runtime
FROM node:20-alpine 

# enable PNPM 
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Copy built files form builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=builder /app/prisma ./prisma

# INstall Prisma CLI for runtime migrations
RUN pnpm add prisma 

# Expose the application port
# for gateway 3000

CMD sh -c "pnpm prisma migrate deploy && pnpm run start:prod"