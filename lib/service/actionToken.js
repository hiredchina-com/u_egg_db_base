'use strict';

const Service = require('egg').Service;

class ActionTokenService extends Service {
  async apply({ data, exp, howLong, secret }) {
    howLong = howLong || (60 * 60 * 24 * 7);
    exp = exp || Math.floor(Date.now() / 1000) + howLong;
    const { ctx } = this;
    return ctx.app.jwt.sign({
      data,
      exp,
    }, secret || ctx.app.config.jwt.secret);
  }

  verify(token, secret) {
    const { ctx } = this;
    const { logger } = ctx;
    if (token) {
      try {
        const verifyObj = ctx.app.jwt.verify(token, secret || ctx.app.config.jwt.secret);
        logger.debug(`verify: ${JSON.stringify(verifyObj)}`);
        return verifyObj.data;
      } catch (error) {
        logger.warn(`Wrong token: ${token}; secret: ${secret}`);
      }
    }
  }

  verify401(token, secret) {
    const { ctx } = this;
    const { logger } = ctx;
    if (token) {
      try {
        const verifyObj = ctx.app.jwt.verify(token, secret || ctx.app.config.jwt.secret);
        return verifyObj.data;
      } catch (error) {
        logger.warn(`Wrong token: ${token}; secret: ${secret}`);
        ctx.throw(401, ctx.__('Wrong token'));
      }
    }
    ctx.throw(401, ctx.__('Missing token'));
  }

}

module.exports = ActionTokenService;
