jest.mock('../../../front-end/collectables/baseCollectable.js');
const BaseCollectable = require('../../../front-end/collectables/baseCollectable.js');

beforeEach(() => {
    BaseCollectable.mockClear();
});

test("constructor is called, returned, and the returned Object is BaseCollectable", () => {
    const spy = jest.spyOn(BaseCollectable.prototype, 'constructor');
    const mb = new BaseCollectable();
    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveReturned();
    expect(mb.constructor).toBe(BaseCollectable);
});

test("playerCollision method is called, and it has returned", () => {
    const spy = jest.spyOn(BaseCollectable.prototype, 'playerCollision');
    const mb = new BaseCollectable();
    mb.playerCollision();
    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveReturned();
});