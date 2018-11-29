'use strict';

module.exports = () => {
  return async function(ctx, next) {
    let token = '',
      user;
    if (
      ctx.headers.authorization && ctx.headers.authorization.split(' ')[0] === 'UTOKEN'
    ) {
      token = ctx.headers.authorization.split(' ')[1];
    } else if (ctx.query.accesstoken) {
      token = ctx.query.accesstoken;
      delete ctx.query.accesstoken;
    } else if (ctx.request.body.accesstoken) {
      token = ctx.request.body.accesstoken;
      delete ctx.request.body.accesstoken;
    }

    if (token) {
      const { service, app } = ctx;
      const { cache, actionToken } = service;

      const data = await actionToken.verify(token, app.config.userSessionSecret);
      if (data && data._id) {
        const key = `user_session_${data._id}`;
        user = await cache.get(key);
      }
    }

    if (!user) {
      return await next();
    }

    ctx.request.user = user;
    ctx.request.token = token;
    await next();
  };
};
