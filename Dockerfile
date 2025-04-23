ARG NODE_VERSION=22
ARG NGINX_VERSION=latest

# ==================================== BASE ====================================
FROM node:${NODE_VERSION}-alpine AS base

# Environments to configure OIDC 
ARG OIDC_CLIENT_ID
ENV VITE_OIDC_CLIENT_ID=${OIDC_CLIENT_ID}

ARG HOSTNAME
ENV VITE_OIDC_REDIRECT_URL=https://${HOSTNAME}/

ARG OIDC_SCOPES
ENV VITE_OIDC_SCOPES=${OIDC_SCOPES}

ARG OIDC_AUTHORITY
ENV VITE_OIDC_AUTHORITY=${OIDC_AUTHORITY}

# Copy requirements (see .dockerignore)
WORKDIR /srv
COPY ["eslint.config.ts", "postcss.config.ts", "tailwind.config.ts", "vite.config.ts", "./"]
COPY [".npmrc", "package.json", "pnpm-lock.yaml", "./"]
COPY ["components.json", "tsconfig.json", "index.html", "./"]
COPY src src

# Install system updates and tools
RUN npm install -g corepack@latest && corepack enable && corepack install
RUN pnpm install

# ================================== BUILDER ===================================
FROM base AS build

# Build the application
RUN pnpm run build

# ================================= PRODUCTION =================================
FROM flashspys/nginx-static:${NGINX_VERSION} AS production

# Install system updates and tools
ENV DEBIAN_FRONTEND=noninteractive
RUN apk update

# Copy and install production requirements
WORKDIR /srv
COPY --from=build /srv/dist /static
# https://github.com/docker-nginx-static/docker-nginx-static/blob/main/Dockerfile#L135C28-L135C58
# copy nginx config that always tries index.html (because SPA)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Change to non root user and expose port
EXPOSE 80

# ================================= DEVELOPMENT ================================
FROM base AS development

# Expose the Vite development server port
EXPOSE 3001

# Define entrypoint and default command
ENTRYPOINT ["pnpm", "run"]
CMD ["dev", "--host", "--no-open"]