FROM docker.button-internal.com/node-baseimage:git-a60ac2c

RUN mkdir /app
WORKDIR /app

ADD package.json yarn.lock /app/
RUN yarn install --pure-lockfile

ADD . /app/

EXPOSE 9059

CMD /bin/bash -c 'npm start 2>&1 | ./bin/shiplogs'