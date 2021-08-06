const path = require('path')
const Redis = require('ioredis')

const redisConfig = {
  host: 'localhost',
  port: 6379,
  password: 'foobared',
  db: 0
}

exports.keys = 'btcbaminfo-api'

exports.security = {
  csrf: {enable: false}
}

exports.middleware = ['ratelimit']

exports.cors = {
    origin: '*'  // Access-Control-Allow-Origin: *
}

exports.redis = {
  client: redisConfig
}

exports.ratelimit = {
  db: new Redis(redisConfig),
  headers: {
    remaining: 'Rate-Limit-Remaining',
    reset: 'Rate-Limit-Reset',
    total: 'Rate-Limit-Total',
  },
  disableHeader: false,
  errorMessage: 'Rate Limit Exceeded',
  duration: 10 * 60 * 1000,
  max: 10 * 60
}

exports.io = {
  redis: {
    ...redisConfig,
    key: 'btcbaminfo-api-socket.io'
  },
  namespace: {
    '/': {connectionMiddleware: ['connection']}
  }
}

exports.sequelize = {
  dialect: 'mysql',
  database: 'btcbam_testnet',
  host: 'localhost',
  port: 3306,
  username: 'btcbam',
  password: 'btcbam123'
}

exports.btcbam = {
  chain: 'testnet'
}

exports.btcbaminfo = {
  path: path.resolve('..', 'btcbaminfo'),
  port: 3001,
  rpc: {
    protocol: 'http',
    host: 'localhost',
    port: 18332,
    user: 'user',
    password: 'password'
  }
}

exports.cmcAPIKey = null
