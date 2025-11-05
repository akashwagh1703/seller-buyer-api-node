const { Pool } = require('pg');

const dbConfigs = {
  'nerace_live_converted_api': {
    host: process.env.DB_HOST_LIVE,
    port: process.env.DB_PORT_LIVE,
    database: process.env.DB_NAME_LIVE,
    user: process.env.DB_USER_LIVE,
    password: process.env.DB_PASSWORD_LIVE,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  },
  'master_uat': {
    host: process.env.DB_HOST_UAT,
    port: process.env.DB_PORT_UAT,
    database: process.env.DB_NAME_UAT,
    user: process.env.DB_USER_UAT,
    password: process.env.DB_PASSWORD_UAT,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  },
  'seller_buyer': {
    host: process.env.DB_HOST_UAT,
    port: process.env.DB_PORT_UAT,
    database: process.env.DB_NAME_UAT,
    user: process.env.DB_USER_UAT,
    password: process.env.DB_PASSWORD_UAT,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  }
};

const pools = {};

const getPool = (dbName) => {
  if (!pools[dbName]) {
    const config = dbConfigs[dbName];
    if (!config) throw new Error(`Database configuration not found: ${dbName}`);
    pools[dbName] = new Pool(config);
  }
  return pools[dbName];
};

const query = async (dbName, text, params) => {
  const pool = getPool(dbName);
  const start = Date.now();
  const res = await pool.query(text, params);
  const duration = Date.now() - start;
  console.log('Executed query', { text, duration, rows: res.rowCount });
  return res;
};

module.exports = { getPool, query };
