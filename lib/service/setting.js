'use strict';

const ApiService = require('./api');
const min10 = 60 * 10;

class SettingService extends ApiService {

  constructor(ctx) {
    super(ctx);
    this._system = 'system';
    this._model = 'setting';
  }

  async getByKey(key) {

    const { service: { system, cache }, ctx } = this;

    const { id: systemId, nameKey } = await system.getSystemObj();

    const cacheKey = `${nameKey}_setting_${key}`;
    let thisValue = await cache.get(cacheKey);
    if (!thisValue) {
      const { list } = await this.list({
        where: JSON.stringify({
          systemId, key,
        }),
      });
      if (list && list.length > 0) {
        const { value } = list[0];
        thisValue = value;
        await cache.set(cacheKey, thisValue, min10);
      }
    }
    if (thisValue) {
      return thisValue;
    }

    ctx.throw(404, `Not setting ${key}`);
  }
}

module.exports = SettingService;
