
const BaseControllerTest = require('./lib/test/baseControllerTest');
const BaseServiceTest = require('./lib/test/baseServiceTest');

const BaseService = require('./lib/core/baseService');
const BaseController = require('./lib/core/baseController');

const ActionToken = require('./lib/service/actionToken');
const ApiService = require('./lib/service/api');
const Cache = require('./lib/service/cache');

const Agent = require('./lib/contoller/agent');
const Base = require('./lib/contoller/base');

const ErrorHandler = require('./lib/middleware/error_handler');
const UserAuth = require('./lib/middleware/user_auth');

module.exports = {
  test: {
    BaseControllerTest,
    BaseServiceTest,
  },
  core: {
    BaseController,
    BaseService
  },
  service: {
    ActionToken,
    ApiService,
    Cache
  },
  contoller: {
    Agent,
    Base
  },
  middleware: {
    ErrorHandler,
    UserAuth
  }
}