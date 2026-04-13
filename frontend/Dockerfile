FROM node:25.5.0

WORKDIR /usr/src/frontend

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev"]