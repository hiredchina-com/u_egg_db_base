# u_egg_db_base


## 提供的方法有
```
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
```

### API 层系统

#### service 调用
##### ActionToken
提供的方法有   
+ async apply({ data, exp, howLong, secret }) 
+ verify(token, secret)
+ verify401(token, secret)

调用
`/app/service/actionToken.js`
```
const { service: { ActionToken } } = require('u_egg_db_base');
module.exports = ActionToken;
```

需要配置   
`/config/config.default.js`
```
config.jwt = {
  secret: config.keys,
  enable: true, // default is false
  match: '/jwt', // optional
};
```
`/config/plugin.js`
```
exports.jwt = {
  enable: true,
  package: 'egg-jwt',
};
```
##### Cache
提供的方法有   
+ async get(key)
+ async set(key, value, seconds)
+ async del(key) 

调用
`/app/service/cache.js`
```
const { service: { Cache } } = require('u_egg_db_base');
module.exports = Cache;
```

需要配置  
`/config/config.default.js`
```
config.redis = {
  client: {
    host: process.env.EGG_REDIS_HOST || '127.0.0.1',
    port: process.env.EGG_REDIS_PORT || 6379,
    password: process.env.EGG_REDIS_PASSWORD || '',
    db: process.env.EGG_REDIS_DB || '0',
  },
};
```
`/config/plugin.js`
```
exports.redis = {
  enable: true,
  package: 'egg-redis',
};
```

##### ApiService
提供的方法有   
+ async getToken(isRefresh)
+ async agent({ path, method = 'get', data, isRefresh = false, time = 1 })
+ async list(payload)
+ async group(payload)
+ async save(payload)
+ async put(payload, _id)
+ async delete(_id)
+ getData(result)

调用
`/app/service/api.js`
```
const { service: { ApiService } } = require('u_egg_db_base');
module.exports = ApiService;
```

`/app/service/ActionToken.js`
```
'use strict';
const { service: { ApiService } } = require('u_egg_db_base');
class EmailService extends ApiService {
  constructor(ctx) {
    super(ctx);
    this._system = 'user';
    this._model = 'email';
  }
}

module.exports = EmailService;
```

需要配置 `Cache` 和 `ActionToken`
`/config/config.default.js`
```
config.system = {
    appid: 'xxxxxxxx',
    secret: 'xxxxxxxxxxxxxxxxxxxxxxxx',
  };
config.serverPath = 'http://server.xxxx.com';
```



#### middleware 调用
ErrorHandler
`/app/middleware/error_handler.js`
```
const { middleware: {ErrorHandler} } = require('u_egg_db_base')
module.exports = ErrorHandler
```
需要配置
`/config/config.default.js`
```
config.middleware = [ 'errorHandler' ];
```

UserAuth 和 ErrorHandler一样，不过需要先配置好 `Cache`, 之后就可以ctx.request.user 获取当前用户  
需要配置
`/config/config.default.js`
```
config.middleware = [ 'userAuth' ];
config.userSessionSecret = 'xxxxxx'; //具体根据login系统的配置
```


#### contoller 调用
##### Agent
提供的方法有   
+ async group()
+ async index()
+ async show()
+ async create()
+ async update() 
+ async destroy()


调用
`/app/contoller/agent.js`
```
const { contoller: { Agent } } = require('u_egg_db_base');
module.exports = Agent;
```

需要配置  `ApiService`  
`/app/router.js`
```
module.exports = app => {
  const { router, controller } = app;
  const APIV1 = '/api/v1';
  router.resources('agent', `${APIV1}/:model`, controller.agent);
};
```
配置model和系统的关系
`/config/config.default.js`
```
config.model = {
  support: 'support',
  phone: 'user',
  email: 'user',
};
```

##### Base
提供的方法有   
+ async agent()
+ async currentUser()  需要配置 UserAuth 中间件
+ async logout()

调用
`/app/contoller/base.js`
```
const { contoller: { Base } } = require('u_egg_db_base');
module.exports = Base;
```

需要配置
`/app/router.js`
```
module.exports = app => {
  const { router, controller } = app;
  const APIV1 = '/api/v1';
  router.get(`${APIV1}/base/logout`, controller.base.logout);
  router.get(`${APIV1}/base/current`, controller.base.currentUser);
  router.get(`${APIV1}/base/:path`, controller.base.agent);
};
```



### DB 层系统

#### core 调用
`/app/controller/works.js`
```
const { core: { BaseController } } = require('u_egg_db_base');
class WorkController extends BaseController {

  constructor(ctx) {
    super({
      ctx,
      serviceName: 'work',
      CreateTransfer: {
        title: { type: 'string', required: true, allowEmpty: false },
        industryKey: { type: 'string', required: true, allowEmpty: false },
      },
    });
  }
}

module.exports = WorkController;
```
`/app/service/works.js`
```
const { core: { BaseService } } = require('u_egg_db_base');
class WorkService extends BaseService {

  constructor(ctx) {
    super({
      ctx,
      model: 'Work',
      updateKeyArr: [ 'companyName', 'companyId', 'companyLine', 'companyLogoimgurl', 'companyIntro', 'industryId', 'industryTitle', 'title', 'startAt', 'endAt', 'isCurrent', 'descriptiont', 'resumeId', 'industryKey' ],
    });
  }
}

module.exports = WorkService;
```


#### test 调用


`/test/app/controller/works.test.js`
```
const { test: BaseControllerTest } = require('u_egg_db_base')
const { assert, app } = require('egg-mock/bootstrap');
const baseUrl = '/api/v1/works';

describe(baseUrl, () => {
  const baseServiceTest = new BaseControllerTest({
    baseUrl,
    app,
    assert,
    baseModel: 'work',
    checkListKey: [ 'title', 'industryKey' ],
    whereParam: 'title',
    willSave: {
      title: 'title',
      industryKey: 'industryKey',
    },
    checkSaveKey: [ 'title', 'industryKey' ],
    willUpdate: {
      title: 'title',
      companyName: 'companyName',
      industryKey: 'industryKey',
    },
    checkUpdateKey: [ 'title', 'companyName', 'industryKey' ],
  });

  describe(`${baseUrl} baseTest`, () => {
    baseServiceTest.baseTest();
  });
});
```


`/test/app/service/works.test.js`
```
const { test: BaseServiceTest } = require('u_egg_db_base')
const { app } = require('egg-mock/bootstrap');
const assert = require('assert-extends');
const baseModel = 'work';

describe(`${baseModel}Service test`, () => {
  const testListOrder = '`title` asc';
  const baseServiceTest = new BaseServiceTest({
    app,
    assert,
    baseModel,
    testListOrder,
    willSave: {
      title: 'title',
      industryKey: 'industryKey',
    },
    checkSaveKey: [ 'title', 'industryKey' ],
    willUpdate: {
      title: 'title',
      companyName: 'companyName',
      industryKey: 'industryKey',
    },
    checkUpdateKey: [ 'title', 'companyName', 'industryKey' ],
  });

  describe('baseTest', () => {
    baseServiceTest.baseTest();
  });

});
```
