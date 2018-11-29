'use strict';

const Service = require('egg').Service;

class CacheService extends Service {
  async get(key) {
    const { redis, logger } = this.app;
    const t = Date.now();
    let data = await redis.get(key);
    if (!data) return;
    try {
      data = JSON.parse(data);
    } catch (error) {
      logger.debug('Cache error', 'get', key, data, error);
    }

    const duration = (Date.now() - t);
    logger.debug('Cache', 'get', key, (duration + 'ms').green);
    return data;
  }

  async set(key, value, seconds) {
    const { redis, logger } = this.app;
    const t = Date.now();
    if (typeof value === 'object') {
      value = JSON.stringify(value);
    }
    if (seconds) {
      await redis.set(key, value, 'EX', parseInt(seconds, 10));
    } else {
      await redis.set(key, value);
    }

    const duration = (Date.now() - t);
    logger.debug('Cache', 'set', key, (duration + 'ms').green);
  }

  async del(key) {
    const { redis, logger } = this.app;
    const t = Date.now();
    await redis.del(key);
    const duration = (Date.now() - t);
    logger.debug('Cache', 'del', key, (duration + 'ms').green);
  }

  // async incr(key, seconds) {
  //   const { redis, logger } = this.app;
  //   const t = Date.now();
  //   const result = await redis.multi().incr(key).expire(key, seconds)
  //     .exec();
  //   const duration = (Date.now() - t);
  //   logger.debug('Cache', 'set', key, (duration + 'ms').green);
  //   return result[0][1];
  // }
}

module.exports = CacheService;
