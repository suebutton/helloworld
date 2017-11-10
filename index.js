/* eslint-disable no-console */

const { get } = require('lodash');
const nodeRedis = require('redis');
const StatsdClient = require('libbtn/logging/statsd-client');
const Metrics = require('libbtn/util/metrics');
const ErrorLogger = require('libbtn/logging/error-logger');
const BigqueryLogger = require('libbtn/logging/bqlog');
const Comstore = require('comstore-client/lib/client');
const ClientStore = require('comstore-client/lib/client-store');
const { COLLECTIONS } = ClientStore;

const createApp = require('./app');
const config = require('./config');
const RedisClient = require('./lib/redis');
const KokiriAdapter = require('./lib/kokiri-adapter');

const statsd = new StatsdClient(config.statsdEnabled ? config.statsd : null);
const metrics = new Metrics({ statsdClient: statsd });
const errorLogger = new ErrorLogger(config.sentryDsn, undefined, true);

const bigqueryLogger =
  get(config, ['bigquery', 'credentials', 'key']) &&
  new BigqueryLogger(
    config.bigquery.projectId,
    config.bigquery.dataset,
    config.bigquery.credentials,
    statsd,
    3000
  );

const redis = new RedisClient(
  nodeRedis.createClient({
    host: config.redis.hostname,
    port: config.redis.port,
    retry_strategy: () => 1000,
  }),
  metrics
);

const comstore = new Comstore(
  config.comstore.url,
  statsd,
  { maxSockets: config.comstore.maxSockets },
  config.comstore.timeoutMillis
);

const clientStore = new ClientStore(
  comstore,
  config.comstore.refreshIntervalMillis,
  [
    COLLECTIONS.WEB_TO_APP_MAPPINGS,
    COLLECTIONS.APPROVALS,
    COLLECTIONS.PARTNER_VALUES,
    COLLECTIONS.PARTNER_PARAMETERS,
  ],
  errorLogger,
  statsd
);

clientStore.start();

const kokiriAdapter = new KokiriAdapter(
  metrics,
  clientStore,
  bigqueryLogger,
  errorLogger
);

const app = createApp({
  port: config.port,
  metrics,
  errorLogger,
  redis,
  kokiriAdapter,
});

let clientStoreHealthy = false;
app.healthChecker.addCheck('client-store', () => {
  clientStoreHealthy = clientStoreHealthy || clientStore.isHealthy();
  return clientStoreHealthy;
});

app.serve();
console.log(`🔗  Kokiri listening on port ${config.port}`);
