FROM node:20-alpine

RUN apk add --no-cache ffmpeg

WORKDIR /app

COPY package.json .

RUN yarn

COPY . .

EXPOSE 8000

CMD ["yarn","run","dev"]