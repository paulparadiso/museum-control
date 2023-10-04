FROM node:alpine AS dashboard-server
WORKDIR /usr/share/app
COPY . .
WORKDIR /usr/share/app/apps/Server
RUN yarn install
WORKDIR /usr/share/app/dashboard
RUN yarn install
RUN yarn build
WORKDIR /usr/share/app
EXPOSE 3333
CMD ["node", "apps/index.js"]

#FROM node:alpine AS dashboard
#WORKDIR /usr/share/app
#COPY ./server/dashboard .
#WORKDIR /usr/share/app/dashboard
#RUN yarn install
#RUN yarn build

