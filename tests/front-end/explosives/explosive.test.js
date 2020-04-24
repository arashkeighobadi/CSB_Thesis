jest.mock('../../../front-end/explosives/explosive.js');
const Explosive = require('../../../front-end/explosives/explosive.js');

beforeEach(() => {
    Explosive.mockClear();
});

test("constructor is called, returned, and the returned Object is Explosive", () => {
    const spy = jest.spyOn(Explosive.prototype, 'constructor');
    const mb = new Explosive();
    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveReturned();
    expect(mb.constructor).toBe(Explosive);
});

test("enableBody method is called, and it has returned", () => {
    const spy = jest.spyOn(Explosive.prototype, 'enableBody');
    const mb = new Explosive();
    mb.enableBody();
    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveReturned();
});

test("setCollideWorldBound method is called, and it has returned", () => {
    const spy = jest.spyOn(Explosive.prototype, 'setCollideWorldBound');
    const mb = new Explosive();
    mb.setCollideWorldBound();
    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveReturned();
});

test("setVelocity method is called, and it has returned", () => {
    const spy = jest.spyOn(Explosive.prototype, 'setVelocity');
    const mb = new Explosive();
    mb.setVelocity();
    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveReturned();
});