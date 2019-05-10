'use strict';
const ApiService = require('./api');

class SystemService extends ApiService {

  constructor(ctx) {
    super(ctx);
    this._system = 'system';
    this._model = 'system';
  }

  set _nameKey(nameKey) {
    this.nameKey = nameKey;
  }

  async getSystemObj() {
    const { nameKey } = this;

    const { service: { cache } } = this;
    const cacheKey = `system_${nameKey}`;
    let retrunObj = await cache.get(cacheKey);
    if (!retrunObj) {
      const { list } = await this.list({
        where: JSON.stringify({ nameKey }),
      });
      if (list && list.length > 0) {
        retrunObj = list[0];
      }
      await cache.set(cacheKey, retrunObj);
    }
    if (retrunObj) {
      return retrunObj;
    }

    const { ctx } = this;
    ctx.throw(404, `Not system ${nameKey}`);
  }

  async getSystem(i18nObj) {
    const {
      service: { i18n },
    } = this;

    if (!i18nObj) {
      i18nObj = await i18n.getI18n();
    }

    const thisSystem = await this.getSystemObj();

    const { titleKey, keyworkKey, descriptionKey, faviconUrl = 'https://image.hiredchina.com/favicon.png', copyrightKey, recordCode } = thisSystem;

    const returnObj = { faviconUrl, titleKey, keyworkKey, descriptionKey, copyrightKey, recordCode };
    const keys = Object.keys(returnObj).filter(n => n.indexOf('Key') > 0);

    for (let j = 0; j < keys.length; j++) {
      const arrKey = keys[j];
      const i18nKey = returnObj[arrKey];

      returnObj[arrKey.replace('Key', '')] = i18nObj[i18nKey];
      delete returnObj[arrKey];
    }

    return returnObj;
  }
}

module.exports = SystemService;
