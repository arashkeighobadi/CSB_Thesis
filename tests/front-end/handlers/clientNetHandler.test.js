jest.mock('../../../front-end/handlers/clientNetHandler.js');
const ClientNetHandler = require('../../../front-end/handlers/clientNetHandler.js');

beforeEach(() => {
    ClientNetHandler.mockClear();
});

test("constructor is called, returned, and the returned Object is XXXXX", () => {
    const spy = jest.spyOn(ClientNetHandler.prototype, 'constructor');
    const mb = new ClientNetHandler();
    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveReturned();
    expect(mb.constructor).toBe(ClientNetHandler);
});

test("emit method is called, and it has returned", () => {
    const spy = jest.spyOn(ClientNetHandler.prototype, 'emit');
    const mb = new ClientNetHandler();
    mb.emit();
    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveReturned();
});

test("searchForOpponent method is called, and it has returned", () => {
    const spy = jest.spyOn(ClientNetHandler.prototype, 'searchForOpponent');
    const mb = new ClientNetHandler();
    mb.searchForOpponent();
    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveReturned();
});

test("listenToServer method is called, and it has returned", () => {
    const spy = jest.spyOn(ClientNetHandler.prototype, 'listenToServer');
    const mb = new ClientNetHandler();
    mb.listenToServer();
    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveReturned();
});

test("playerDisconnected method is called, and it has returned", () => {
    const spy = jest.spyOn(ClientNetHandler.prototype, 'playerDisconnected');
    const mb = new ClientNetHandler();
    mb.playerDisconnected();
    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveReturned();
});

test("moveOpponent method is called, and it has returned", () => {
    const spy = jest.spyOn(ClientNetHandler.prototype, 'moveOpponent');
    const mb = new ClientNetHandler();
    mb.moveOpponent();
    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveReturned();
});

