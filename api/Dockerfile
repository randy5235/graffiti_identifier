# base image
FROM node:14.17.6-stretch

# set working directory
WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# install and cache app dependencies
COPY package.json /app/package.json
RUN npm install --silent
# RUN npm install react-scripts@3.0.1 -g --silent

COPY . .

# RUN npm run tsc
# start app
CMD ["npm", "run", "dev"]

