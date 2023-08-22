FROM selenium/standalone-chrome:115.0

RUN curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -

RUN sudo apt-get install -y nodejs

WORKDIR /server

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 4003

CMD ["npm", "run", "production"]
