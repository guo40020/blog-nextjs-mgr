FROM node:14.15.1-buster

RUN mkdir /app/
COPY . /app/
WORKDIR /app/
RUN yarn
RUN yarn build

EXPOSE 3001

CMD yarn start -p 3001

