FROM docker.button-internal.com/node-baseimage:git-fd031b3
MAINTAINER Will Myers <will@usebutton.com>

RUN mkdir /app
WORKDIR /app

ADD package.json yarn.lock /app/
RUN yarn install --pure-lockfile

ADD . /app/

EXPOSE 3000

CMD /bin/sh -c 'npm start 2>&1 | shiplogs'
