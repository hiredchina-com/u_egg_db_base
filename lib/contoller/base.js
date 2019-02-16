'use strict';

const Controller = require('egg').Controller;

class BaseController extends Controller {
  async agent() {
    const { ctx, service } = this;
    const { api } = service;
    let { path } = ctx.params;
    path = decodeURIComponent(path);
    const result = await api.agent({
      path,
    });
    const res = api.getData(result);
    ctx.helper.success({ ctx, res });
  }

  async currentUser() {
    const { ctx } = this;
    const res = ctx.request.user || { roles: ['guest']};
    if (res) {
      delete res.id;
    }
    ctx.helper.success({ ctx, res });
  }

  async logout() {
    const { ctx } = this;
    const { cache } = ctx.service;
    if (ctx.request.user) {
      const key = `user_session_${ctx.request.user.id}`;
      await cache.del(key);
      ctx.request.user = null;
    }
    ctx.helper.success({ ctx });
  }
}

module.exports = BaseController;
