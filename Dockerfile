FROM docker.button-internal.com/node-baseimage:git-8df1116
MAINTAINER Will Myers <will@usebutton.com>

RUN mkdir /app
WORKDIR /app

ADD package.json yarn.lock /app/
RUN yarn install --pure-lockfile

ADD . /app/

EXPOSE 3000

CMD ["/usr/local/bin/yarn", "start"]
