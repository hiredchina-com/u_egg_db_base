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
    let { page, limit, isPaging, noCount = false, where, sortby, attributes } = payload;

    if (where) {
      where = JSON.parse(where);
    }
    if (attributes) {
      attributes = JSON.parse(attributes);
    }

    const selectObj = { where, attributes };

    selectObj.order = Sequelize.literal(sortby || 'id DESC');

    let count;
    if(!noCount) {
      count = await ctx.model[this.model].count({where});
    }

    if (!isPaging) {
      limit = helper.toInt(limit) || ctx.app.config.default_limit;
      page = helper.toInt(page) || ctx.app.config.default_page;

      selectObj.offset = (page - 1) * limit;
      selectObj.limit = limit > count ? count : limit
    } else {
      page = ctx.app.config.default_page;
    }
    const list = await ctx.model[this.model].findAll(selectObj);

    return { count, list, limit, currentPage: page };
  }

  // show======================================================================================================>
  async show(id) {
    const { ctx, logger } = this;
    const entity = await ctx.model[this.model].findByPk(id);
    if (!entity) {
      logger.warn(`${this.model} id: ${id} not found`)
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
    const { ctx, logger } = this;
    const entity = await ctx.model[this.model].findByPk(id);
    if (!entity) {
      logger.warn(`${this.model} id: ${id} not found`)
      ctx.throw(404, ctx.__('Data not found'));
    }
    return entity.destroy();
  }

  // update======================================================================================================>
  async update(id, payload) {
    const { ctx, logger } = this;
    const entity = await ctx.model[this.model].findByPk(id);
    let canSave = true;
    if (!entity) {
      canSave = false;
      logger.warn(`${this.model} id: ${id} not found`)
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

