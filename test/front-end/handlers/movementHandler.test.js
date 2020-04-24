jest.mock('../../../front-end/handlers/movementHandler.js');
const MovementHandler = require('../../../front-end/handlers/movementHandler.js');

beforeEach(() => {
    MovementHandler.mockClear();
});

test("constructor is called, returned, and the returned Object is XXXXX", () => {
    const spy = jest.spyOn(MovementHandler.prototype, 'constructor');
    const mb = new MovementHandler();
    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveReturned();
    expect(mb.constructor).toBe(MovementHandler);
});

test("move method is called, and it has returned", () => {
    const spy = jest.spyOn(MovementHandler.prototype, 'move');
    const mb = new MovementHandler();
    mb.move();
    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveReturned();
});

test("stop method is called, and it has returned", () => {
    const spy = jest.spyOn(MovementHandler.prototype, 'stop');
    const mb = new MovementHandler();
    mb.stop();
    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveReturned();
});

