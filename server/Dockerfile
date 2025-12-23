# ----- dependencies stage -----
FROM node:20-alpine AS deps

WORKDIR /app

# Install pnpm using corepack with specific version
RUN corepack enable && corepack prepare pnpm@10.26.1 --activate

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# ----- development stage -----
FROM node:20-alpine AS development

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@10.26.1 --activate

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY package.json pnpm-lock.yaml ./

# Copy source
COPY . .

EXPOSE 3000

CMD ["pnpm", "dev"]

# ----- build stage -----
FROM node:20-alpine AS build

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@10.26.1 --activate

COPY --from=deps /app/node_modules ./node_modules
COPY package.json pnpm-lock.yaml ./

COPY tsconfig.json ./
COPY src ./src

# Build and verify output
RUN pnpm build && \
    echo "Build completed. Checking dist folder..." && \
    ls -la && \
    if [ ! -d "dist" ]; then echo "ERROR: dist folder not created!"; exit 1; fi

# ----- runtime stage (production) -----
FROM node:20-alpine AS runtime

WORKDIR /app

ENV NODE_ENV=production

# Only production deps
RUN corepack enable && corepack prepare pnpm@10.26.1 --activate
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --production

COPY --from=build /app/dist ./dist

EXPOSE 3000

CMD ["node", "dist/index.js"]
