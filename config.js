const fs = require('fs');
const { get, merge } = require('lodash');

const {
  NODE_ENV,
  PORT,
  REDIS_HOSTNAME,
  REDIS_PORT,
  COMSTORE_URL,
  STATSD_PORT_8125_UDP_ADDR,
  STATSD_PORT_8125_UDP_PORT,
  SENTRY_DSN,
  BIGQUERY_CLIENT_EMAIL,
  BIGQUERY_PRIVATE_KEY,
} = process.env;

let inDockerContainer = true;

try {
  fs.accessSync('/.dockerenv');
} catch (e) {
  inDockerContainer = false;
}

const LOCALHOST = inDockerContainer ? 'docker.for.mac.localhost' : '127.0.0.1';

const DEFAULT_PORT = 3000;
const DEFAULT_REDIS_HOSTNAME = LOCALHOST;
const DEFAULT_REDIS_PORT = '6379';
const DEFAULT_COMSTORE_URL = 'http://comstore-ecs-staging.button-internal.com';
const DEFAULT_STATSD_HOSTNAME = LOCALHOST;
const DEFAULT_STATSD_PORT = '8125';

const defaultConfig = {
  port: PORT || DEFAULT_PORT,
  redis: {
    hostname: REDIS_HOSTNAME || DEFAULT_REDIS_HOSTNAME,
    port: REDIS_PORT || DEFAULT_REDIS_PORT,
  },
  comstore: {
    url: COMSTORE_URL || DEFAULT_COMSTORE_URL,
    maxSockets: 5,
    timeoutMillis: 1000 * 5,
    refreshIntervalMillis: 1000 * 30,
  },
  statsdEnabled: false,
  statsd: {
    debug: true,
    host: STATSD_PORT_8125_UDP_ADDR || DEFAULT_STATSD_HOSTNAME,
    port: STATSD_PORT_8125_UDP_PORT || DEFAULT_STATSD_PORT,
    prefix: `kokiri.${NODE_ENV || 'development'}`,
  },
  sentryDsn: SENTRY_DSN,
  bigquery: {
    dataset: null,
    projectId: null,
    credentials: {
      email: BIGQUERY_CLIENT_EMAIL,
      key: BIGQUERY_PRIVATE_KEY,
    },
  },
};

const environmentOverrides = get(
  {
    staging: {
      comstore: {
        maxSockets: 20,
      },
      statsdEnabled: true,
      statsd: {
        debug: false,
      },
      bigquery: {
        dataset: 'staging',
        projectId: 'btn-dlc',
      },
    },
    production: {
      comstore: {
        maxSockets: 50,
      },
      statsdEnabled: true,
      statsd: {
        debug: false,
      },
      bigquery: {
        dataset: 'production',
        projectId: 'btn-dlc',
      },
    },
  },
  NODE_ENV,
  {}
);

module.exports = merge({}, defaultConfig, environmentOverrides);
