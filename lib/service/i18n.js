'use strict';

const ApiService = require('./api');
const min10 = 60 * 10;

class I18nService extends ApiService {

  constructor(ctx) {
    super(ctx);
    this._system = 'support';
    this._model = 'i18n';
  }

  async getI18n() {
    const {
      ctx: {
        request: { lan },
      },
    } = this;

    return this.getI18nLang(lan);
  }

  async getI18nLang(lan) {
    const {
      service: { system, cache },
      ctx: { app: { config: { debug = true } } },
    } = this;

    const { id: systemId } = await system.getSystem();

    const i18nSystemIdKey = `i18n_${lan}_system_${systemId}`;
    let retrunObj = null;
    if (this.ctx.app.config.env === 'prod' || !debug) {
      retrunObj = await cache.get(i18nSystemIdKey);
    }
    if (!retrunObj) {
      const path = `/i18n/${systemId}/${lan}`;
      retrunObj = this.getData(await this.agent({
        path: `/api/${this.system}/${encodeURIComponent(path)}`,
      }));
      await cache.set(i18nSystemIdKey, retrunObj, min10);
    }
    return retrunObj;
  }

  async getAllI18n() {
    const {
      service: { system, cache },
    } = this;

    const { id: systemId } = await system.getSystemObj();
    const i18nSystemIdKey = `i18n_system_${systemId}`;
    let retrunObj = await cache.get(i18nSystemIdKey);
    if (!retrunObj) {
      const arr = [
        'en-US',
        'zh-CN',
      ];
      const obj = {};
      for (let i = 0; i < arr.length; i++) {
        const lang = arr[i];
        const data = this.getI18nLang(lang);
        obj[lang] = data;
      }
      retrunObj = obj;
      await cache.set(i18nSystemIdKey, retrunObj, min10);
    }
    return retrunObj;
  }
}

module.exports = I18nService;
