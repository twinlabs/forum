FROM node:8
RUN mkdir /code
ADD . /code
RUN mkdir /code/build
WORKDIR /code
RUN npm install
EXPOSE 80
