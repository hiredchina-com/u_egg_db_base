'use strict';

class BaseControllerTest {
  constructor({ baseUrl, app, assert, baseModel, checkListKey, whereParam, willSave, checkSaveKey, willSaveValidate, willUpdate, willUpdate422Keys }) {
    this.baseUrl = baseUrl;
    this.baseModel = baseModel;
    this.assert = assert;
    this.app = app;
    this.checkListKey = checkListKey;
    this.whereParam = whereParam;

    this.willSave = willSave;
    this.checkSaveKey = checkSaveKey;
    this.willSaveValidate = willSaveValidate;
    this.willUpdate = willUpdate;
    this.willUpdate422Keys = willUpdate422Keys;
  }


  indexTest() {
    it(`GET ${this.baseUrl}`, async () => {
      const { app, assert, baseModel, baseUrl, checkListKey, whereParam } = this;
      // 通过 factory-girl 快速创建 user 对象到数据库中
      await app.factory.createMany(baseModel, 3);

      let res = await app.httpRequest().get(`${baseUrl}?limit=2`);
      assert(res.status === 200);
      assert(res.body.data.count === 3);
      assert(res.body.data.list.length === 2);
      if (checkListKey) {
        for (const n in checkListKey) {
          const key = checkListKey[n];
          assert(res.body.data.list[0][key]);
        }
      }

      res = await app.httpRequest().get(`${baseUrl}`);
      assert(res.status === 200);
      assert(res.body.data.count === 3);
      assert(res.body.data.list.length === 3);
      if (checkListKey) {
        for (const n in checkListKey) {
          const key = checkListKey[n];
          assert(res.body.data.list[0][key]);
        }
      }

      const resWhere = await app.httpRequest().get(`${baseUrl}?limit=2&where=${JSON.stringify({
        [whereParam]: res.body.data.list[0][whereParam],
      })}`);
      assert(resWhere.status === 200);
      assert(resWhere.body.data.count === 1);
      assert(resWhere.body.data.list.length === 1);
      if (checkListKey) {
        for (const n in checkListKey) {
          const key = checkListKey[n];
          assert(resWhere.body.data.list[0][key] === res.body.data.list[0][key]);
        }
      }
    });
  }
  showTest() {
    it(`GET ${this.baseUrl}/:id`, async () => {
      const { app, assert, baseModel, baseUrl, checkListKey } = this;
      const entry = await app.factory.create(baseModel);

      const res = await app.httpRequest().get(`${baseUrl}/${entry.id}`);
      assert(res.status === 200);
      if (checkListKey) {
        for (const n in checkListKey) {
          const key = checkListKey[n];
          assert(res.body.data[key] === entry[key]);
        }
      }

    });
  }

  postTest() {
    it(`POST ${this.baseUrl}`, async () => {
      const { app, assert, checkSaveKey, baseUrl, willSave, willSaveValidate } = this;
      app.mockCsrf();

      let res = await app.httpRequest().post(baseUrl)
        .send(willSave);
      assert(res.status === 201);
      assert(res.body.data.id);

      res = await app.httpRequest().get(`${baseUrl}/${res.body.data.id}`);
      assert(res.status === 200);

      if (checkSaveKey) {
        for (const n in checkSaveKey) {
          const key = checkSaveKey[n];
          assert(res.body.data[key]);
        }
      }
      if (willSaveValidate) {
        res = await app.httpRequest().post(baseUrl)
          .send(willSaveValidate);
        assert(res.status === 422);
      }
    });
  }

  deleteTest() {
    it(`DELETE ${this.baseUrl}/:id`, async () => {
      const { app, assert, baseModel, baseUrl } = this;
      const entry = await app.factory.create(baseModel);

      app.mockCsrf();
      const res = await app.httpRequest().delete(`${baseUrl}/${entry.id}`);
      assert(res.status === 204);

      const res404 = await app.httpRequest().delete(`${baseUrl}/1000`);
      assert(res404.status === 404);
    });
  }

  updateTest() {
    it(`PATCH ${this.baseUrl}/:id`, async () => {
      const { app, assert, baseModel, baseUrl, willUpdate, willUpdate422Keys } = this;
      const entry1 = await app.factory.create(baseModel);
      const entry2 = await app.factory.create(baseModel);
      if (willUpdate) {
        app.mockCsrf();
        const res404 = await app.httpRequest().patch(`${baseUrl}/1000`)
          .send(willUpdate);
        assert(res404.status === 404);


        if (willUpdate422Keys) {
          for (const n in willUpdate422Keys) {
            const key = willUpdate422Keys[n];
            const willUpdate422 = {
              [key]: entry2[key],
            };
            const updateRes422 = await app.httpRequest().patch(`${baseUrl}/${entry1.id}`)
              .send(willUpdate422);
            assert(updateRes422.status === 422);
          }
        }

        const updateRes = await app.httpRequest().patch(`${baseUrl}/${entry1.id}`)
          .send(willUpdate);
        assert(updateRes.status === 201);

        const res1 = await app.httpRequest().get(`${baseUrl}/${entry1.id}`);
        assert(res1.status === 200);

        const resData1 = res1.body.data;
        for (const key1 in willUpdate) {
          if (willUpdate.hasOwnProperty(key1) && resData1.hasOwnProperty(key1)) {
            assert(`${resData1[key1]}` === `${willUpdate[key1]}`);
          }
          for (const key2 in entry1) {
            if (key1 !== key2) {
              if (entry1.hasOwnProperty(key2) && resData1.hasOwnProperty(key2)) {
                assert(`${resData1[key2]}` === `${entry1[key2]}`);
              }
            }
          }
        }
      }
    });
  }
  baseTest() {
    this.indexTest();
    this.showTest();
    this.postTest();
    this.updateTest();
    this.deleteTest();
  }

}

module.exports = BaseControllerTest;
