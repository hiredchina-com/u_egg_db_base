'use strict';

const Service = require('egg').Service;
const qn = require('qn');
// https://github.com/node-modules/qn

// qnAccess ={
//   accessKey: 'your access key',
//   secretKey: 'your secret key',
//   bucket: 'your bucket name',
//   origin: 'http://{bucket}.u.qiniudn.com',
//   // timeout: 3600000, // default rpc timeout: one hour, optional
//   // if your app outside of China, please set `uploadURL` to `http://up.qiniug.com/`
//   // uploadURL: 'http://up.qiniu.com/',
// }

class QnService extends Service {
  constructor({ ctx , qnAccess }) {
    super(ctx);
    this.client = qn.create(qnAccess);
  }

  token(user) {
    if (!user) {
      return { errSms: 'login.first' };
    }
    const token = this.client.uploadToken();
    return { token, origin: qnAccess.origin };
  }

}

module.exports = QnService;
