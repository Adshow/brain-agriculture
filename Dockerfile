FROM node:20

WORKDIR /usr/src/app

COPY package*.json ./

# RUN apt-get update && apt-get install -y fonts-noto && rm -rf /var/lib/apt/lists/*
RUN npm install

COPY . .

RUN npm run build

CMD ["npm", "run", "start:dev"]