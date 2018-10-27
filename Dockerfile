# We need

# 1) node 6.x.x
# 2) postgres
# 3)

FROM node:6
RUN mkdir /code
ADD . /code
RUN mkdir /code/build
ADD . /code/builddock
WORKDIR /code
RUN npm install
EXPOSE 80
CMD ["npm", "test"]

