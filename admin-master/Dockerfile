FROM node:14

RUN npm install -g http-server react-scripts
RUN npm install -g react-scripts
RUN mkdir -p /app

WORKDIR /app
COPY package.json /app

RUN npm install

ADD . /app
RUN npm run build

CMD ["http-server", "build", "-p", "3000"]




