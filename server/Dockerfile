FROM selenium/standalone-chrome:115.0

USER root

RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash -

RUN apt-get install -y nodejs

RUN groupadd -r app && useradd -r -g app app

WORKDIR /server

COPY package*.json ./

RUN npm install

COPY . .

USER app

EXPOSE 4003

CMD ["npm", "run", "production"]
