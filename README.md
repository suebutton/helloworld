# 🔗  Kokiri

Where links come from!  Ask it for attributes of a link, or for Button
attributed app and web links.

* **[Prod](http://kokiri-ecs-prod.button-internal.com)**
* **[Staging](http://kokiri-ecs-staging.button-internal.com)**

Requests for links are Approval sensitive (will return `null` if no Approval
is set).

## Protocol

For a full description of the protocol, consult `docs/protocol.md`.  Here are
the basics:

* `POST /v1/link/attributes`: Get meta data about a link
* `POST /v1/link/app-action`: Get an SDK consumable App Action
  (app link + browser link)
* `POST /v1/link/web-action`: Get a Boomerang consumable Web Action
  (app link + browser link)
* `POST /v1/sdk/config`: Get an configuration object consumable by SDKs for
  determining Button support for a link
* `POST /v1/support/app-links`: Get a report of app linking capability for a merchant

If you have a Button Request Id handy, please pass it as the `X-Button-Request`
HTTP header.

## Dependencies

1. Comstore (web-to-app-mappings and approvals)
2. A redis cache (_optional_).  This cache is used for mapping urls to their
   redirect location.  Used only as a performance improvement.  The service
   operates slowly without it.  To use, `$ brew install redis; redis-server`

## Local Setup

* Kokiri runs on node `v8.9.1`
* It uses Comstore's staging instance locally by default

```bash
$ nvm use 8.9.1
$ yarn
$ yarn start
```

#### ...with Docker

```bash
$ docker build -t kokiri .
$ docker run -p 3000:3000 -ti kokiri
```

_n.b. running Kokiri inside of Docker and talking to redis on the host machine
requires Docker>=17.06.0_

## Local with Pint

Install Pint:

```
curl https://s3-us-west-2.amazonaws.com/button-archive/go/pint/darwin/pint-latest > /usr/local/bin/pint
chmod +x /usr/local/bin/pint
```

Run:

```bash
$ nvm use 8.9.1
$ pint setup
$ pint run yarn start
```

#### ...Pint with Docker

```bash
$ pint docker build
$ pint docker run
```

## Handy Commands

* `yarn start`: Run the server
* `yarn test`: Run the tests
* `yarn run lint`: Manually run the linter
* `yarn run format`: Manually run the code formatter
* `yarn run coverage`: Generate a code coverage report, apply salt to taste.

## Environment Variables

* `NODE_ENV`: The running environment's name
* `PORT=3000`: The port to listen on
* `REDIS_HOST=localhost`: The hostname of a redis instance to use
* `REDIS_PORT=6379`: The port of a redis instance to use
* `COMSTORE_URL=http://comstore-ecs-staging.button-internal.com`: The location
  of a Comstore instance
* `STATSD_PORT_8125_UDP_ADDR=localhost`: The hostname of a statsd instance to
  use
* `STATSD_PORT_8125_UDP_PORT=8125`: The port of a statsd instance to use
* `SENTRY_DSN`: A Sentry DSN url
* `BIGQUERY_PRIVATE_KEY` A BigQuery Private Key
* `BIGQUERY_CLIENT_EMAIL` A BigQuery Email

## FAQ

**Why does my code keep getting reformatted?**

Kokiri is set up with a git pre-commit hook which runs all javascript through
a code formatter called [prettier](https://github.com/prettier/prettier).  This
helps us keep our codebase consistently formatted and reduces the burden of
fixing a bunch of lint violations.
