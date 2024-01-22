FROM node:18-alpine as build

ARG NPM_MAIL
ARG NPM_AUTH_TOKEN

WORKDIR /usr/src/app

COPY . .

COPY .npmnrc.docker .npmrc

RUN npm i

RUN rm -f .npmrc

RUN npm run build

FROM nginx:stable-alpine as run

WORKDIR /usr/share/nginx/html

COPY --from=0 /usr/src/app/dist/pwa ./

COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 8080

ENTRYPOINT ["nginx", "-g", "daemon off;"]
