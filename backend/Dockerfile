FROM node:25.5.0

WORKDIR /usr/src/backend

COPY package*.json ./
RUN npm install

COPY . .

CMD ["npm", "run", "build", "&&", "npm", "run", "prod"]