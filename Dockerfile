FROM --platform=linux/amd64 node:20.10.0-alpine3.15

WORKDIR /app

COPY . .

RUN yarn install
RUN yarn build

EXPOSE 3000

CMD ["yarn","start"]
