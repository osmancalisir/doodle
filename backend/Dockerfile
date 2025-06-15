FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . .

RUN yarn build

FROM node:20-alpine

WORKDIR /app

RUN apk add --no-cache postgresql-client

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --production

COPY --from=builder /app/dist ./dist

COPY ./db /src/db

RUN chmod +x /src/db/init.sh

EXPOSE 4000

CMD ["yarn", "start"]
