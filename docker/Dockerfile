FROM mhart/alpine-node:12
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
COPY package.json /app
COPY package-lock.json /app
RUN npm install
RUN npm install -g @angular/cli@11.0.3
COPY . /app
EXPOSE 4200
CMD ng serve --host 0.0.0.0