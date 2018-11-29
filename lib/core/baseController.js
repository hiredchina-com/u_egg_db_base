'use strict';

const Controller = require('egg').Controller;


class BaseController extends Controller {

  constructor({ ctx, serviceName, CreateTransfer, UpdateTransfer }) {
    super(ctx);

    this.CreateTransfer = CreateTransfer;
    this.serviceName = serviceName;
    this.UpdateTransfer = UpdateTransfer;
  }

  async index() {
    const { ctx, service } = this;
    // 组装参数
    const payload = ctx.query;
    // 调用 Service 进行业务处理
    const res = await service[this.serviceName].index(payload);
    // 设置响应内容和响应状态码
    ctx.helper.success({ ctx, res });
  }

  // 获取单个数据
  async show() {
    const { ctx, service } = this;
    // 组装参数
    const { id } = ctx.params;
    // 调用 Service 进行业务处理
    const res = await service[this.serviceName].show(id);
    // 设置响应内容和响应状态码
    ctx.helper.success({ ctx, res });
  }

  // 创建
  async create() {
    const { ctx, service } = this;
    // 校验参数
    if (this.CreateTransfer) {
      ctx.validate(this.CreateTransfer);
    }
    // 组装参数
    const payload = ctx.request.body;
    // 调用 Service 进行业务处理
    const res = await service[this.serviceName].create(payload);
    // 设置响应内容和响应状态码
    ctx.helper.success({ ctx, res, status: 201 });
  }

  // 修改
  async update() {
    const { ctx, service } = this;

    if (this.UpdateTransfer) {
      ctx.validate(this.UpdateTransfer);
    }
    // 组装参数
    const { id } = ctx.params;
    const payload = ctx.request.body;
    // 调用 Service 进行业务处理
    const res = await service[this.serviceName].update(id, payload);
    // 设置响应内容和响应状态码
    ctx.helper.success({ ctx, res, status: 201 });
  }

  // 删除单个数据
  async destroy() {
    const { ctx, service } = this;
    // 校验参数
    const { id } = ctx.params;
    // 调用 Service 进行业务处理
    await service[this.serviceName].destroy(id);
    // 设置响应内容和响应状态码
    ctx.helper.success({ ctx, status: 204 });
  }
}

module.exports = BaseController;
