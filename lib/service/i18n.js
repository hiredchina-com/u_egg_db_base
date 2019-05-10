'use strict';

const ApiService = require('./api');

class I18nService extends ApiService {

  constructor(ctx) {
    super(ctx);
    this._system = 'support';
    this._model = 'i18n';
  }

  async getI18n() {
    const {
      service: { system, cache },
      ctx: {
        request: { lan },
      },
    } = this;

    const { id: systemId } = await system.getSystemObj();

    const i18nSystemIdKey = `i18n_${lan}_system_${systemId}`;

    let retrunObj = await cache.get(i18nSystemIdKey);
    if (!retrunObj) {
      const path = `/i18n/${systemId}/${lan}`;
      retrunObj = this.getData(await this.agent({
        path: `/api/${this.system}/${encodeURIComponent(path)}`,
      }));
      await cache.set(i18nSystemIdKey, retrunObj);
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
      const path = `/i18n/${systemId}`;
      retrunObj = this.getData(await this.agent({
        path: `/api/${this.system}/${encodeURIComponent(path)}`,
      }));
      await cache.set(i18nSystemIdKey, retrunObj);
    }
    return retrunObj;
  }
}

module.exports = I18nService;
