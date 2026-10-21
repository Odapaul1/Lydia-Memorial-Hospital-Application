# Build the front-end, then run the Express server that also serves it.
FROM node:22-alpine AS build
WORKDIR /app
RUN corepack enable
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm build

FROM node:22-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
RUN corepack enable
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile --prod=false
COPY --from=build /app/dist ./dist
COPY --from=build /app/src ./src
COPY --from=build /app/server ./server
COPY --from=build /app/tsconfig.json ./tsconfig.json
COPY --from=build /app/public ./public
EXPOSE 3000
CMD ["pnpm", "start"]
