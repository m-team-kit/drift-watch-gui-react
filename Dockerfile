ARG NODE_VERSION=22
ARG NGINX_VERSION=latest

# ==================================== BASE ====================================
FROM node:${NODE_VERSION}-alpine AS base

# Arguments for the build process
ARG HOSTNAME
ARG OIDC_CLIENT_ID
ARG OIDC_AUTHORITY
ARG OIDC_SCOPES="openid profile email basic roles web-origins"
ARG API_BASEPATH=/api/latest

ARG DOCS_URL
ARG GITHUB_URL
ARG TERMS_USE_URL
ARG PRIVACY_POLICY_URL
ARG LEGALS_URL

# Set environment variables for the application
ENV VITE_OIDC_CLIENT_ID=${OIDC_CLIENT_ID}
ENV VITE_OIDC_REDIRECT_URL=https://${HOSTNAME}/
ENV VITE_OIDC_SCOPES=${OIDC_SCOPES}
ENV VITE_OIDC_AUTHORITY=${OIDC_AUTHORITY}
ENV VITE_API_BASEPATH=https://${HOSTNAME}${API_BASEPATH}

ENV VITE_DOCS_URL=${DOCS_URL}
ENV VITE_GITHUB_URL=${GITHUB_URL}
ENV VITE_ACCEPTABLE_USE_POLICY_URL=${TERMS_USE_URL}
ENV VITE_PRIVACY_POLICY_URL=${PRIVACY_POLICY_URL}
ENV VITE_LEGALS_URL=${LEGALS_URL}

# Copy requirements (see .dockerignore)
WORKDIR /srv
COPY ["eslint.config.ts", "postcss.config.ts", "tailwind.config.ts", "vite.config.ts", "./"]
COPY [".npmrc", "package.json", "pnpm-lock.yaml", "./"]
COPY ["components.json", "tsconfig.json", "index.html", "./"]
COPY ["public", "./"]
COPY src src

# Install system updates and tools
# NOTE: pnpm@latest resolves to v11+ which breaks the v9 lockfile and blocks
# dependency build scripts (e.g. esbuild) by default. Pinned to 9.15.5 to match
# the committed pnpm-lock.yaml. --frozen-lockfile enforces reproducible installs.
# RUN npm install -g corepack@latest && corepack enable && corepack prepare pnpm@latest --activate
# RUN pnpm install
RUN npm install -g corepack@latest \
    && corepack enable \
    && corepack prepare pnpm@9.15.5 --activate

RUN pnpm install --frozen-lockfile

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
EXPOSE 80

# Define entrypoint and default command
ENTRYPOINT ["pnpm", "run"]
CMD ["dev", "--host", "--port=80", "--no-open"]