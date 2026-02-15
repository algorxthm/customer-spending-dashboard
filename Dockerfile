# ---- Build frontend ----
FROM node:20-alpine AS builder
WORKDIR /app

# Install frontend deps
COPY package*.json ./
RUN npm ci

# Build
COPY . .
RUN npm run build

# ---- Runtime: serve API + built frontend ----
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=4000

# Install server deps only
COPY server/package*.json ./server/
RUN npm --prefix server ci --omit=dev

# Copy server source + built frontend
COPY server ./server
COPY --from=builder /app/dist ./dist

EXPOSE 4000
CMD ["node", "server/index.js"]
