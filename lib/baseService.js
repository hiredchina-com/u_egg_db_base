'use strict';

const Service = require('egg').Service;

class BaseService extends Service {

  constructor({ ctx, model, updateKeyArr }) {
    super(ctx);
    this.model = model;
    this.updateKeyArr = updateKeyArr;
  }
  // index======================================================================================================>
  async index(payload) {
    const { ctx } = this;
    const { helper } = ctx;
    const { Sequelize } = ctx.app;
    let { page, limit, isPaging, where, sortby } = payload;

    if (where) {
      where = JSON.parse(where);
    }

    const selectObj = { where };

    selectObj.order = Sequelize.literal(sortby || 'id DESC');

    if (!isPaging) {
      limit = helper.toInt(limit) || ctx.app.config.default_limit;
      page = helper.toInt(page) || ctx.app.config.default_page;

      selectObj.offset = (page - 1) * limit;
      selectObj.limit = limit;
    } else {
      page = ctx.app.config.default_page;
    }

    const res = await ctx.model[this.model].findAndCountAll(selectObj);

    return { count: res.count, list: res.rows, limit, currentPage: page };
  }


  // show======================================================================================================>
  async show(id) {
    const { ctx } = this;
    const entity = await ctx.model[this.model].findById(id);
    if (!entity) {
      ctx.throw(404, ctx.__('Data not found'));
    }
    return entity;
  }

  // create======================================================================================================>
  async create(payload) {
    const { ctx } = this;
    return ctx.model[this.model].create(payload);
  }

  // destroy======================================================================================================>
  async destroy(id) {
    const { ctx } = this;
    const entity = await ctx.model[this.model].findById(id);
    if (!entity) {
      ctx.throw(404, ctx.__('Data not found'));
    }
    return entity.destroy();
  }

  // update======================================================================================================>
  async update(id, payload) {
    const { ctx } = this;
    const entity = await ctx.model[this.model].findById(id);
    let canSave = true;
    if (!entity) {
      canSave = false;
      ctx.throw(404, ctx.__('Data not found'));
    }

    if (canSave) {
      const willUpdate = ctx.helper.getKeyObj({ obj: payload, keyArr: this.updateKeyArr });

      await entity.update(willUpdate);
      return entity;
    }
  }

}

module.exports = BaseService;

