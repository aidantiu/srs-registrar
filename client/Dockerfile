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

EXPOSE 5173

CMD ["pnpm", "dev", "--host", "0.0.0.0", "--port", "5173"]

# ----- build stage -----
FROM node:20-alpine AS build

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@10.26.1 --activate

# Copy dependencies
COPY --from=deps /app/node_modules ./node_modules
COPY package.json pnpm-lock.yaml ./

# Copy source and build
COPY . .
RUN pnpm build

# ----- runtime stage (production) -----
FROM nginx:stable-alpine AS runtime

WORKDIR /app

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built assets to nginx
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80