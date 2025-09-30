FROM node:trixie-slim

WORKDIR /usr/src/app

ENV PATH /usr/src/app/node_modules/.bin:$PATH

COPY package.json .
COPY package-lock.json .
RUN npm i

EXPOSE 5173

CMD ["vite", "--host"]