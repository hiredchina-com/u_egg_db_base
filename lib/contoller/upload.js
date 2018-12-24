'use strict';

const Controller = require('egg').Controller;

class UploadController extends Controller {

  async attachment() {
    const { ctx, service } = this;
    const { attachment } = service;
    const { user, body } = ctx.request;

    const res = await attachment.justSave(body, user);
    ctx.helper.success({ ctx, res });
  }

  async token() {
    const { ctx, service } = this;
    const { qn } = service;
    const { user } = ctx.request;
    const res = qn.token(user);
    ctx.helper.success({ ctx, res });
  }
}

module.exports = UploadController;
