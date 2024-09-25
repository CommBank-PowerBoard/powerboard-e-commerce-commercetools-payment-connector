FROM node:18-alpine3.18

ARG CONNECT_SERVICE_URL_APP
ENV CONNECT_SERVICE_URL_APP=$CONNECT_SERVICE_URL_APP

COPY . /app
WORKDIR /app/merchant-center-custom-application/

RUN npm install
RUN npm ci --only=prod
EXPOSE 3001
CMD [ "node", "run", "start" ]