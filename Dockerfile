FROM node:18

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

ENV PORT=8005

EXPOSE 8005

CMD ["node", "index.js"]
