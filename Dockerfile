FROM node:argon

MAINTAINER paulvand@cisco.com

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json /usr/src/app/
RUN npm install

# Bundle app source
COPY . /usr/src/app

EXPOSE 3001

#RUN npm install -g forever
#CMD [ "forever", "./bin/www" ]
#CMD [ "npm", "start" ]
CMD [ "node", "app.js"]
