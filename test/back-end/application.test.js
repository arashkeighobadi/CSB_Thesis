jest.mock('../../application.js');
const Application = require('../../application.js');

beforeEach(() => {
    Application.mockClear();
});

test("constructor is called, returned, and the returned Object is Application", () => {
    const spy = jest.spyOn(Application.prototype, 'constructor');
    const mb = new Application();
    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveReturned();
    expect(mb.constructor).toBe(Application);
});

test("setupDatabase method is called, and it has returned", () => {
    const spy = jest.spyOn(Application.prototype, 'setupDatabase');
    const mb = new Application();
    mb.setupDatabase();
    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveReturned();
});

test("getUsers method is called, and it has returned", () => {
    const spy = jest.spyOn(Application.prototype, 'getUsers');
    const mb = new Application();
    mb.getUsers();
    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveReturned();
});