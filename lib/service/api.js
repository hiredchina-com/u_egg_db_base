'use strict';

const Service = require('egg').Service;

class ApiService extends Service {

  constructor(ctx) {
    super(ctx);
    this.apiVersion = '/api/v1';
  }

  set _system(system) {
    this.system = system;
  }

  set _model(model) {
    this.model = model;
  }

  set _apiVersion(apiVersion) {
    this.apiVersion = apiVersion;
  }

  async getToken(isRefresh) {
    const { ctx } = this;
    const { service, app } = ctx;
    const { config } = app;
    const { cache } = service;
    const key = config.keys;
    let token;

    if (!isRefresh) {
      token = await cache.get(key);
    }

    if (!token) {
      const result = await ctx.curl(`${ctx.app.config.serverPath}/auth`, {
        method: 'post',
        data: config.system,
        dataType: 'json',
      });
      token = this.getData(result).token;
      await cache.set(key, token);
    }
    if (token) {
      return token;
    }
    ctx.throw(401, ctx.__('Can not get the system token'));
  }

  async agent({ path, method = 'get', data, isRefresh = false, time = 1, timeout = 5000 }) {
    const { ctx } = this;
    const { logger } = ctx;
    if (time < 4) {
      const token = await this.getToken(isRefresh);
      const url = `${ctx.app.config.serverPath}${path}`;

      let finalUrl = url;
      const { lan } = ctx.request;
      if (lan && url.indexOf('?') > 0) {
        finalUrl = `${url}&lan=${lan}`;
      } else {
        finalUrl = `${url}?lan=${lan}`;
      }
      if (data) {
        delete data.lan;
      }

      if (timeout > 10000) {
        timeout = 10000
      }

      const curlObj = {
        method,
        data,
        headers: {
          authorization: `Bearer ${token}`,
        },
        dataType: 'json',
        timeout
      };
      if (method === 'del') {
        curlObj.dataType = 'text';
      }

      const result = await ctx.curl(finalUrl, curlObj);
      logger.info(`${method} ${finalUrl} data:${JSON.stringify(data)}`);
      if (result.status === 401) {
        time++;
        return await this.agent({
          path, method, data, isRefresh: true, time,
        });
      }
      return result;
    }
    ctx.throw(503, ctx.__('Request 3 time, still 401'));
  }

  async list(payload, timeout) {
    const path = `${this.apiVersion}/${this.model}s`;
    return this.getData(await this.agent({
      path: `/api/${this.system}/${encodeURIComponent(path)}`,
      data: payload,
      timeout,
    }));
  }

  async group(payload, timeout) {
    const path = `${this.apiVersion}/${this.model}s/group`;
    return this.getData(await this.agent({
      path: `/api/${this.system}/${encodeURIComponent(path)}`,
      data: payload,
      timeout,
    }));
  }

  async save(payload) {
    const path = `${this.apiVersion}/${this.model}s`;
    return this.getData(await this.agent({
      path: `/api/${this.system}/${encodeURIComponent(path)}`,
      method: 'post',
      data: payload,
    }));
  }

  async put(payload, _id) {
    const path = `${this.apiVersion}/${this.model}s/${_id}`;
    return this.getData(await this.agent({
      path: `/api/${this.system}/${encodeURIComponent(path)}`,
      method: 'put',
      data: payload,
    }));
  }

  async delete(_id) {
    const path = `${this.apiVersion}/${this.model}s/${_id}`;
    return this.getData(await this.agent({
      path: `/api/${this.system}/${encodeURIComponent(path)}`,
      method: 'delete',
    }));
  }

  async get(_id) {
    const path = `${this.apiVersion}/${this.model}s/${_id}`;
    return this.getData(await this.agent({
      path: `/api/${this.system}/${encodeURIComponent(path)}`,
    }));
  }

  getData(result) {
    if (result.status >= 200 && result.status < 300) {
      if (result.status === 204) {
        return;
      } else if (result.data.code === 0) {
        return result.data.data;
      }
    }
    const { ctx } = this;
    ctx.throw(result.status, result.data.error);
  }
}

module.exports = ApiService;
