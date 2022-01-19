# building stage - make sure our package is hardened
FROM node:alpine as builder
WORKDIR /app
COPY . .
RUN yarn install && yarn buid

FROM node:alpone
COPY --from=builder 