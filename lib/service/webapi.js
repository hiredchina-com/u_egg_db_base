'use strict';

const Service = require('egg').Service;

const { stringify } = require('qs');
const min10 = 60 * 10;
class WebapiService extends Service {

  async proxy({ path, method = 'get', body, query }) {
    const { ctx, logger } = this;
    const { app: { config: { apiPath } } } = ctx;

    const proxyObj = {
      method,
      dataType: 'json',
    };
    if (body) {
      proxyObj.data = { ...body };
    }

    let url = `${apiPath}${path}`;
    if (query) {
      url = `${url}?${stringify(query)}`;
    }

    const res = await ctx.curl(url, proxyObj);
    logger.info(`${method} ${url} ${res.status}`);
    if (res.status !== 204) {
      return res.data;
    }
    return {};
  }

  async footer() {
    const { service: { cache, system } } = this;

    const { id } = await system.getSystemObj();

    const cacheKey = `footer_system_${id}`;
    let retrunObj = await cache.get(cacheKey);
    if (!retrunObj) {
      const { data } = await this.proxy({ path: '/api/v1/base/%2Ffooter' });
      retrunObj = data;
      await cache.set(cacheKey, retrunObj, min10);
    }

    return retrunObj;
  }


}
module.exports = WebapiService;
