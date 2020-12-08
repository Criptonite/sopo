FROM mhart/alpine-node:14
RUN npm install -g @angular/cli
WORKDIR /app
COPY project/nosql-UI/package*.json ./
RUN npm ci --production-only
COPY project/nosql-UI /app
EXPOSE 4200
CMD ng serve