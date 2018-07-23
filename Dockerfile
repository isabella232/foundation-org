FROM bankexlabs/node:9-alpine
MAINTAINER Oleg Makarov <om@bankexfoundation.org>

RUN mkdir /fdb-org

WORKDIR /fdb-org

ADD . /fdb-org
RUN npm install --quiet node-gyp -g && npm install && npm rebuild bcrypt --build-from-source && npm rebuild node-sass && npm install -g grunt-cli
RUN grunt

ENTRYPOINT ["/usr/local/bin/npm", "start"]

EXPOSE 3000
