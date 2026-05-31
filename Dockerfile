# ==========================================
# Phase 1: Build Engine
# ==========================================
FROM oven/bun:1.1-alpine AS builder
WORKDIR /workspace

# Copy dependencies manifest
COPY package*.json bun.lock* ./
RUN bun install --frozen-lockfile

# Copy project files
COPY . .

# Compile optimized static bundle
RUN bun run build

# ==========================================
# Phase 2: Active Server Runtime
# ==========================================
FROM oven/bun:1.1-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=8080

# Retrieve dependencies for runtime
COPY --from=builder /workspace/package*.json ./
COPY --from=builder /workspace/node_modules ./node_modules
COPY --from=builder /workspace/server ./server
COPY --from=builder /workspace/dist ./dist

# Expose HTTP gateway
EXPOSE 8080

# Run the Bun unified server proxy
CMD ["bun", "run", "server/index.js"]
