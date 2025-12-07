# --- Build stage ---
FROM node:20-alpine AS build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install deps
RUN npm install

# Copy source
COPY . .

# Build with environment variables
ARG VITE_API_URL
ARG VITE_WEBSOCKET_URL

ENV VITE_API_URL=$VITE_API_URL
ENV VITE_WEBSOCKET_URL=$VITE_WEBSOCKET_URL

RUN npm run build


# --- Production stage ---
FROM node:20-alpine AS prod

WORKDIR /app

# Serve static build using a small HTTP server
RUN npm install -g serve

COPY --from=build /app/dist ./dist

EXPOSE 5173

CMD ["serve", "-s", "dist", "-l", "4173"]
