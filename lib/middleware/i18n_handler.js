'use strict';
const util = require('util_react_web');

module.exports = () => {
  return async function(ctx, next) {
    let { lan } = ctx.query;

    const { request, service: { user: userService, cache } } = ctx;
    const { user } = request;
    const { url: {fixLan} } = util

    if (user) {
      if (!lan) {
        lan = user.lastLanguage;
        lan = fixLan(lan)
      }
      if (lan !== user.lastLanguage) {
        user.lastLanguage = lan;
        await userService.put({ lastLanguage: lan }, user.id);
        const key = `user_session_${user.id}`;
        const oneWeek = 60 * 60 * 24 * 7;
        await cache.set(key, user, oneWeek);
      }
    }
    ctx.request.lan = lan || 'en-US';
    await next();
  };
};
