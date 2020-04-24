jest.mock('../../../front-end/explosives/bullet.js');
const Bullet = require('../../../front-end/explosives/bullet.js');

beforeEach(() => {
    Bullet.mockClear();
});

test("constructor is called, returned, and the returned Object is Bullet", () => {
    const spy = jest.spyOn(Bullet.prototype, 'constructor');
    const mb = new Bullet();
    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveReturned();
    expect(mb.constructor).toBe(Bullet);
});

test("onWorldBounds method is called, and it has returned", () => {
    const spy = jest.spyOn(Bullet.prototype, 'onWorldBounds');
    const mb = new Bullet();
    mb.onWorldBounds();
    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveReturned();
});