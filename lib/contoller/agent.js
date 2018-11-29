'use strict';

const Controller = require('egg').Controller;


class AgentController extends Controller {

  async group() {
    const { ctx, service, config } = this;
    const { model } = ctx.params;
    const { api } = service;
    // 组装参数
    const payload = ctx.query;
    // 调用 Service 进行业务处理
    if (!config.model[model]) {
      ctx.throw(400, ctx.__('Not this model defind!'));
    }
    api._system = config.model[model];
    api._model = model;

    const res = await api.group(payload);
    // 设置响应内容和响应状态码
    ctx.helper.success({ ctx, res });
  }

  async index() {
    const { ctx, service, config } = this;
    const { model } = ctx.params;
    const { api } = service;
    // 组装参数
    const payload = ctx.query;
    // 调用 Service 进行业务处理
    if (!config.model[model]) {
      ctx.throw(400, ctx.__('Not this model defind!'));
    }
    api._system = config.model[model];
    api._model = model;

    if (model === 'support') {
      const { sortby } = payload;
      if (!sortby) {
        payload.sortby = '`index` DESC, titleKey';
      }
    }

    const res = await api.list(payload);
    // 设置响应内容和响应状态码
    ctx.helper.success({ ctx, res });
  }

  // 获取单个数据
  async show() {
    const { ctx, service, config } = this;
    const { api } = service;
    // 组装参数
    const { id, model } = ctx.params;
    // 调用 Service 进行业务处理
    if (!config.model[model]) {
      ctx.throw(400, ctx.__('Not this model defind!'));
    }
    api._system = config.model[model];
    api._model = model;

    const res = await api.get(id);
    // 设置响应内容和响应状态码
    ctx.helper.success({ ctx, res });
  }

  // 创建
  async create() {
    const { ctx, service, config } = this;
    const { api } = service;
    // 组装参数
    const payload = ctx.request.body;
    const { model } = ctx.params;
    // 调用 Service 进行业务处理
    if (!config.model[model]) {
      ctx.throw(400, ctx.__('Not this model defind!'));
    }
    api._system = config.model[model];
    api._model = model;
    const res = await api.save(payload);
    // 设置响应内容和响应状态码
    ctx.helper.success({ ctx, res, status: 201 });
  }

  // 修改
  async update() {
    const { ctx, service, config } = this;
    const { api } = service;

    // 组装参数
    const { id, model } = ctx.params;
    const payload = ctx.request.body;
    // 调用 Service 进行业务处理
    if (!config.model[model]) {
      ctx.throw(400, ctx.__('Not this model defind!'));
    }
    api._system = config.model[model];
    api._model = model;
    const res = await api.put(payload, id);
    // 设置响应内容和响应状态码
    ctx.helper.success({ ctx, res, status: 201 });
  }

  // 删除单个数据
  async destroy() {
    const { ctx, service, config } = this;
    const { api } = service;
    // 校验参数
    const { id, model } = ctx.params;
    // 调用 Service 进行业务处理
    if (!config.model[model]) {
      ctx.throw(400, ctx.__('Not this model defind!'));
    }
    api._system = config.model[model];
    api._model = model;
    await api.delete(id);
    // 设置响应内容和响应状态码
    ctx.helper.success({ ctx, status: 204 });
  }
}

module.exports = AgentController;
