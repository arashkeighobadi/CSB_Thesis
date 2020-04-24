jest.mock('../../../front-end/handlers/actionHandler.js');
const ActionHandler = require('../../../front-end/handlers/actionHandler.js');

beforeEach(() => {
    ActionHandler.mockClear();
});

test("constructor is called, returned, and the returned Object is ActionHandler", () => {
    const spy = jest.spyOn(ActionHandler.prototype, 'constructor');
    spy.mockImplementation(() => {});
    const mb = new ActionHandler();
    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveReturned();
    expect(mb.constructor).toBe(ActionHandler);
});

test("listenForAction method is called, and it has returned", () => {
    const spy = jest.spyOn(ActionHandler.prototype, 'listenForAction');
    spy.mockImplementation(() => {});
    const mb = new ActionHandler();
    mb.listenForAction();
    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveReturned();
});

test("onWorldBounds method is called, and it has returned", () => {
    const spy = jest.spyOn(ActionHandler.prototype, 'onWorldBounds');
    spy.mockImplementation(() => {});
    const mb = new ActionHandler();
    mb.onWorldBounds();
    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveReturned();
});

//template for importing and mocking
// jest.mock('../../front-end/paaaaath.js');
// const XXXXX = require('../../front-end/paaaaath.js');

//template for clearing mock before each test
// beforeEach(() => {
//     XXXXX.mockClear();
// });

//template for constructor
// test("constructor is called, returned, and the returned Object is XXXXX", () => {
//     const spy = jest.spyOn(XXXXX.prototype, 'constructor');
//     spy.mockImplementation(() => {});
//     const mb = new XXXXX();
//     expect(spy).toHaveBeenCalled();
//     expect(spy).toHaveReturned();
//     expect(mb.constructor).toBe(XXXXX);
// });

//template for methods
// test("xxxxx method is called, and it has returned", () => {
//     const spy = jest.spyOn(XXXXX.prototype, 'xxxxx');
//     spy.mockImplementation(() => {});
//     const mb = new XXXXX();
//     mb.xxxxx();
//     expect(spy).toHaveBeenCalled();
//     expect(spy).toHaveReturned();
// });