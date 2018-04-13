const fs = require('fs');
const { get, merge } = require('lodash');

const {
  NODE_ENV,
  PORT,
  REDIS_HOST,
  REDIS_PORT,
  COMSTORE_URL,
  SENTRY_DSN,
  BIGQUERY_CLIENT_EMAIL,
  BIGQUERY_PRIVATE_KEY,
} = process.env;

const inDockerContainer = (() => {
  try {
    fs.accessSync('/.dockerenv');
    return true;
  } catch (e) {
    return false;
  }
})();

const LOCALHOST = inDockerContainer ? 'docker.for.mac.localhost' : '127.0.0.1';

const DEFAULT_PORT = 3000;
const DEFAULT_REDIS_HOST = LOCALHOST;
const DEFAULT_REDIS_PORT = '6379';
const DEFAULT_COMSTORE_URL = 'http://comstore-ecs-staging.button-internal.com';

const defaultConfig = {
  port: PORT || DEFAULT_PORT,
  redis: {
    hostname: REDIS_HOST || DEFAULT_REDIS_HOST,
    port: REDIS_PORT || DEFAULT_REDIS_PORT,
  },
  comstore: {
    url: COMSTORE_URL || DEFAULT_COMSTORE_URL,
    maxSockets: 5,
    timeoutMillis: 1000 * 5,
    refreshIntervalMillis: 1000 * 30,
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
      bigquery: {
        dataset: 'staging',
        projectId: 'btn-dlc',
      },
    },
    production: {
      comstore: {
        maxSockets: 50,
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
