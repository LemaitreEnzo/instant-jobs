FROM node:22-alpine

WORKDIR /usr/src/frontend

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 5173

CMD ["npm run build && npm run dev"]