
jest.mock('../../../front-end/collectables/collectable.js');
const Collectable = require('../../../front-end/collectables/collectable.js');

beforeEach(() => {
    Collectable.mockClear();
});

test("constructor is called, returned, and the returned Object is Collectable", () => {
    const spy = jest.spyOn(Collectable.prototype, 'constructor');
    const mb = new Collectable();
    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveReturned();
    expect(mb.constructor).toBe(Collectable);
});

test("enableBody method is called, and it has returned", () => {
    const spy = jest.spyOn(Collectable.prototype, 'enableBody');
    const mb = new Collectable();
    mb.enableBody();
    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveReturned();
});

test("setOwnerTeam method is called, and it has returned", () => {
    const spy = jest.spyOn(Collectable.prototype, 'setOwnerTeam');
    const mb = new Collectable();
    mb.setOwnerTeam();
    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveReturned();
});