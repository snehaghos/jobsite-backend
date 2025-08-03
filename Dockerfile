FROM node:alpine

WORKDIR /app/sneha/src

COPY package*.json /app/sneha

COPY /src /app/sneha/src/

COPY .env /app/sneha/.env

COPY . /app/sneha

RUN npm ci

EXPOSE 5000

CMD [ "npm","run","dev" ]

