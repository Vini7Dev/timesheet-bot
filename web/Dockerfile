FROM node:20-alpine3.19

WORKDIR /web

COPY package*.json ./

RUN yarn

COPY . .

RUN yarn build

# RUN rm -rf ./src

EXPOSE 3000

CMD ["yarn", "production"]
