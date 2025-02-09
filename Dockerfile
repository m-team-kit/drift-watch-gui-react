FROM node:22 AS build

WORKDIR /app
COPY [".env", ".npmrc", "components.json", "eslint.config.ts", "index.html", "package.json", "pnpm-lock.yaml", "postcss.config.ts", "tailwind.config.ts", "tsconfig.json", "vite.config.ts", "./"]
COPY src src
RUN npm install -g corepack@latest && corepack enable && corepack install && pnpm install
ENV NODE_ENV=production
RUN pnpm run build

FROM flashspys/nginx-static:latest AS static
COPY --from=build /app/dist /static
EXPOSE 80
