FROM --platform=linux/amd64 node:20-bullseye AS builder

WORKDIR /usr/app

COPY src ./src

COPY package.json tsconfig.json ./

RUN NODE_ENV=develpment yarn install

RUN yarn run build

FROM --platform=linux/amd64 node:20-bullseye AS production

WORKDIR /usr/app

COPY --from=builder /usr/app/dist/ ./dist
COPY --from=builder /usr/app/yarn.lock ./yarn.lock

COPY package.json ./

RUN NODE_ENV=production yarn install --frozen-lockfile

ENTRYPOINT [ "node", "./dist/index.js" ]
