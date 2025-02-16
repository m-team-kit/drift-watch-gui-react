FROM node:22-alpine AS build

WORKDIR /app
COPY [".env", ".npmrc", "components.json", "eslint.config.ts", "index.html", "package.json", "pnpm-lock.yaml", "postcss.config.ts", "tailwind.config.ts", "tsconfig.json", "vite.config.ts", "./"]
COPY src src

ARG OIDC_CLIENT_ID
ARG HOSTNAME
ARG OIDC_SCOPES
ARG OIDC_AUTHORITY
ENV VITE_OIDC_CLIENT_ID=${OIDC_CLIENT_ID}
ENV VITE_OIDC_REDIRECT_URL=https://${HOSTNAME}/
ENV VITE_OIDC_SCOPES=${OIDC_SCOPES}
ENV VITE_OIDC_AUTHORITY=${OIDC_AUTHORITY}

RUN npm install -g corepack@latest && corepack enable && corepack install && pnpm install
RUN pnpm run build

FROM flashspys/nginx-static:latest AS static
COPY --from=build /app/dist /static
# https://github.com/docker-nginx-static/docker-nginx-static/blob/main/Dockerfile#L135C28-L135C58
# copy nginx config that always tries index.html (because SPA)
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
