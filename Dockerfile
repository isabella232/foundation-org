FROM starefossen/ruby-node:alpine
MAINTAINER Oleg Makarov <om@bankexfoundation.org>

RUN mkdir /fdb-org

WORKDIR /fdb-org

ADD . /fdb-org
RUN apk add --update make gcc g++
RUN npm install
RUN gem install github-pages

ENTRYPOINT ["/usr/local/bin/npm", "start"]

EXPOSE 3000
