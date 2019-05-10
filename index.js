
const BaseControllerTest = require('./lib/test/baseControllerTest');
const BaseServiceTest = require('./lib/test/baseServiceTest');

const BaseService = require('./lib/core/baseService');
const BaseController = require('./lib/core/baseController');

const ActionToken = require('./lib/service/actionToken');
const ApiService = require('./lib/service/api');
const Cache = require('./lib/service/cache');
const Qn = require('./lib/service/qn');
const I18nService = require('./lib/service/i18n');
const Setting = require('./lib/service/setting');
const System = require('./lib/service/system');
const Webapi = require('./lib/service/webapi');

const Agent = require('./lib/contoller/agent');
const Base = require('./lib/contoller/base');
const Upload = require('./lib/contoller/upload');

const ErrorHandler = require('./lib/middleware/error_handler');
const UserAuth = require('./lib/middleware/user_auth');
const I18n = require('./lib/middleware/i18n_handler');



module.exports = {
  BaseControllerTest, //兼容旧版本
  BaseServiceTest,//兼容旧版本
  BaseService,//兼容旧版本
  BaseController, //兼容旧版本
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
    Cache,
    Qn,
    I18nService,
    Setting,
    System,
    Webapi
  },
  contoller: {
    Agent,
    Base,
    Upload
  },
  middleware: {
    ErrorHandler,
    UserAuth,
    I18n
  }
}