
'use strict';

class BaseServiceTest {
  constructor({ app, assert, baseModel, testListOrder, willSave, checkSaveKey, willSaveValidate, willUpdate, checkUpdateKey, validateErrorRegular, updateValidateErrorRegular, willUpdateValidate }) {
    this.baseModel = baseModel;
    this.assert = assert;
    this.app = app;
    this.testListOrder = testListOrder;
    this.willSave = willSave;
    this.checkSaveKey = checkSaveKey;
    this.willSaveValidate = willSaveValidate;
    this.willUpdate = willUpdate;
    this.checkUpdateKey = checkUpdateKey;
    this.validateErrorRegular = validateErrorRegular;
    this.updateValidateErrorRegular = updateValidateErrorRegular;
    this.willUpdateValidate = willUpdateValidate;
  }
  limit2ListTest() {
    it('should limit 2 data and order id DESC', async () => {
      const { assert, app, baseModel } = this;
      // 通过 factory-girl 快速创建 数据 对象到数据库中
      const list = await app.factory.createMany(baseModel, 50);

      const returnObj = await app.mockContext().service[baseModel].index({ limit: 2 });
      assert(returnObj.count === 50);
      assert(returnObj.list.length === 2);
      assert(returnObj.list[0].id === list[49].id);
      assert(returnObj.list[0].id > returnObj.list[1].id);
      assert(returnObj.limit === 2);
      assert(returnObj.currentPage === 1);
    });
  }
  justOneListTest() {
    it('should just one data', async () => {
      const { assert, app, baseModel } = this;
      // 通过 factory-girl 快速创建 数据 对象到数据库中
      const list = await app.factory.createMany(baseModel, 50);

      const id = list[0].id;
      const returnObj = await app.mockContext().service[baseModel].index({ where: JSON.stringify({
        id,
      }) });
      assert(returnObj.count === 1);
      assert(returnObj.list.length === 1);
      assert(returnObj.list[0].id === id);
    });
  }
  limit20ListTest() {
    it('should limit 20 data', async () => {
      const { assert, app, baseModel } = this;
      // 通过 factory-girl 快速创建 数据 对象到数据库中
      const list = await app.factory.createMany(baseModel, 50);

      const returnObj = await app.mockContext().service[baseModel].index({});
      assert(returnObj.count === 50);
      assert(returnObj.list.length === 20);
      assert(returnObj.list[0].id === list[49].id);
      assert(returnObj.limit === 20);
      assert(returnObj.currentPage === 1);
    });
  }
  page3ListTest() {
    it('should in page 3', async () => {
      const { assert, app, baseModel } = this;
      // 通过 factory-girl 快速创建 数据 对象到数据库中
      const list = await app.factory.createMany(baseModel, 50);

      const returnObj = await app.mockContext().service[baseModel].index({ page: 3 });
      assert(returnObj.count === 50);
      assert(returnObj.list.length === 10);
      assert(returnObj.list[0].id === list[9].id);
      assert(returnObj.limit === 20);
      assert(returnObj.currentPage === 3);
    });
  }
  pagingListTest() {
    it('should paging', async () => {
      const { assert, app, baseModel } = this;
      // 通过 factory-girl 快速创建 数据 对象到数据库中
      await app.factory.createMany(baseModel, 50);

      const returnObj = await app.mockContext().service[baseModel].index({ page: 4, isPaging: true });
      assert(returnObj.count === 50);
      assert(returnObj.list.length === 50);
      assert(!returnObj.limit);
      assert(returnObj.currentPage === 1);
    });
  }
  orderListTest() {
    const { assert, app, baseModel, testListOrder } = this;
    it(`should order ${testListOrder}`, async () => {
      // 通过 factory-girl 快速创建 数据 对象到数据库中
      const list = await app.factory.createMany(baseModel, 50);

      const returnObj = await app.mockContext().service[baseModel].index({ sortby: testListOrder });
      assert(returnObj.count === 50);
      assert(returnObj.list.length === 20);
      assert(returnObj.limit === 20);
      assert(returnObj.currentPage === 1);
      assert(returnObj.list[0].id === list[0].id);
    });
  }
  indexBaseTest() {
    this.limit2ListTest();
    this.justOneListTest();
    this.limit20ListTest();
    this.page3ListTest();
    this.pagingListTest();
    this.orderListTest();
  }
  getTest() {
    it('should get exists data', async () => {
      const { assert, app, baseModel } = this;
      // 通过 factory-girl 快速创建 数据 对象到数据库中
      const entity = await app.factory.create(baseModel);
      const returnObj = await app.mockContext().service[baseModel].show(entity.id);
      assert(returnObj.id === entity.id);
    });
  }
  noExistsGetTest() {
    it('should not get no exists data', async () => {
      const { assert, app, baseModel } = this;
      const ctx = app.mockContext();

      return assert.asyncThrows(
        async () => {
          await ctx.service[baseModel].show(10000);
        },
        /^NotFoundError: Data not found$/
      );
    });
  }
  showBaseTest() {
    this.getTest();
    this.noExistsGetTest();
  }

  createTest() {
    it('Should can create', async () => {
      const { assert, app, baseModel, willSave, checkSaveKey } = this;
      if (willSave) {
        const returnObj = await app.mockContext().service[baseModel].create(willSave);
        if (!returnObj.id) {
          console.log(`createTest returnObj.id: ${returnObj.id}, checkSaveKey: ${JSON.stringify(checkSaveKey)}`)
        }
        assert(returnObj.id);
        if (checkSaveKey) {
          for (const n in checkSaveKey) {
            const key = checkSaveKey[n];
            if (returnObj.hasOwnProperty(key) && willSave.hasOwnProperty(key)) {
              if (`${returnObj[key]}` !== `${willSave[key]}`) {
                console.log(`createTest returnObj[${key}] !== willSave[${key}] | returnObj[${key}]:${returnObj[key]}, willSave[${key}]:${willSave[key]}`)
              }
              assert(`${returnObj[key]}` === `${willSave[key]}`);
            }
          }
        }
      }
    });
  }
  cantCreateTest() {
    const { assert, app, baseModel, willSaveValidate } = this;
    if (willSaveValidate) {
      it('Validate should can‘t create', async () => {
        return assert.asyncThrows(
          async () => {
            await app.mockContext().service[baseModel].create(willSaveValidate);
          },
          this.validateErrorRegular
        );
      });
    }
  }
  createBaseTest() {
    this.createTest();
    this.cantCreateTest();
  }

  updateTest() {
    it('should update succeed', async () => {
      const { assert, app, baseModel, willUpdate, checkUpdateKey } = this;
      if (willUpdate) {
        const entity = await app.factory.create(baseModel);

        // 创建 ctx
        const ctx = app.mockContext();
        const service = ctx.service[baseModel];
        let returnObj = await service.update(entity.id, willUpdate);

        for (const key1 in willUpdate) {
          if (willUpdate.hasOwnProperty(key1) && returnObj.hasOwnProperty(key1)) {
            if (`${returnObj[key1]}` !== `${willUpdate[key1]}`) {
              console.log(`updateTest returnObj[${key1}] !== willUpdate[${key1}] | returnObj[${key1}]:${returnObj[key1]}, willUpdate[${key1}]:${willUpdate[key1]}`)
            }
            assert(`${returnObj[key1]}` === `${willUpdate[key1]}`);
          }
          for (const n in checkUpdateKey) {
            const key2 = checkUpdateKey[n];
            if (key1 !== key2) {
              if (entity.hasOwnProperty(key2) && returnObj.hasOwnProperty(key2)) {
                if (`${returnObj[key2]}` !== `${entity[key2]}`) {
                  console.log(`updateTest returnObj[${key2}] !== entity[${key2}] | returnObj[${key2}]:${returnObj[key2]}, entity[${key2}]:${entity[key2]}`)
                }
                assert(`${returnObj[key2]}` === `${entity[key2]}`);
              }
            }
          }
        }

        returnObj = await service.show(entity.id);
        for (const key1 in willUpdate) {
          if (willUpdate.hasOwnProperty(key1) && returnObj.hasOwnProperty(key1)) {
            if (`${returnObj[key1]}` !== `${willUpdate[key1]}`) {
              console.log(`updateTest returnObj[${key1}] !== willUpdate[${key1}] | returnObj[${key1}]:${returnObj[key1]}, willUpdate[${key1}]:${willUpdate[key1]}`)
            }
            assert(`${returnObj[key1]}` === `${willUpdate[key1]}`);
          }
          for (const n in checkUpdateKey) {
            const key2 = checkUpdateKey[n];
            if (key1 !== key2) {
              if (entity.hasOwnProperty(key2) && returnObj.hasOwnProperty(key2)) {
                if (`${returnObj[key2]}` !== `${entity[key2]}`) {
                  console.log(`updateTest returnObj[${key2}] !== entity[${key2}] | returnObj[${key2}]:${returnObj[key2]}, entity[${key2}]:${entity[key2]}`)
                }
                assert(`${returnObj[key2]}` === `${entity[key2]}`);
              }
            }
          }
        }
      }
    });
  }
  updateNotExistTest() {
    it('should not update succeed not exist data', async () => {
      const { assert, app, baseModel } = this;
      return assert.asyncThrows(
        async () => {
          await app.mockContext().service[baseModel].update(10000, {});
        },
        /^NotFoundError: Data not found$/
      );
    });
  }

  cantUpdateTest() {
    const { assert, app, baseModel, willUpdateValidate, updateValidateErrorRegular } = this;
    if (willUpdateValidate) {
      it('Validate should can‘t create', async () => {
        const entity = await app.factory.create(baseModel);
        return assert.asyncThrows(
          async () => {
            await app.mockContext().service[baseModel].update(entity.id, willUpdateValidate);
          },
          updateValidateErrorRegular
        );
      });
    }
  }

  updateBaseTest() {
    this.updateTest();
    this.updateNotExistTest();
    this.cantUpdateTest();
  }

  destroyTest() {
    it('should destroy succeed', async () => {
      const { assert, app, baseModel } = this;
      const entity = await app.factory.create(baseModel);

      // 创建 ctx
      const ctx = app.mockContext();
      const service = ctx.service[baseModel];

      const returnObj = await service.show(entity.id);
      assert(returnObj);

      await service.destroy(entity.id);

      return assert.asyncThrows(
        async () => {
          await service.show(entity.id);
        },
        /^NotFoundError: Data not found$/
      );
    });
  }
  destroyNotExistTest() {
    it('should not destroy succeed', async () => {
      const { assert, app, baseModel } = this;
      return assert.asyncThrows(
        async () => {
          await app.mockContext().service[baseModel].destroy(10000);
        },
        /^NotFoundError: Data not found$/
      );
    });
  }
  destroyBaseTest() {
    this.destroyTest();
    this.destroyNotExistTest();
  }

  baseTest() {
    this.indexBaseTest();
    this.showBaseTest();
    this.createBaseTest();
    this.updateBaseTest();
    this.destroyBaseTest();
  }
}

module.exports = BaseServiceTest;
