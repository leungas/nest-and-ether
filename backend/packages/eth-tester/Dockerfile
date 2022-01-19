FROM node:16.13-alpine3.14 AS builder
WORKDIR /app
COPY ./packages/fotolio-backend .
COPY ./yarn.lock .
RUN yarn install && yarn build
# remove dev dependencies from node_modules
RUN yarn install --production

FROM node:16.13-alpine3.14
RUN apk update && apk upgrade && apk add --no-cache libxml2=2.9.12-r1 imagemagick=7.0.11.14-r0
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser
WORKDIR /app
COPY --chown=appuser:appgroup --from=builder /app/dist ./dist
COPY --chown=appuser:appgroup --from=builder /app/node_modules ./node_modules
COPY --chown=appuser:appgroup --from=builder /app/package.json /app/yarn.lock ./
EXPOSE 3088
CMD node dist/main