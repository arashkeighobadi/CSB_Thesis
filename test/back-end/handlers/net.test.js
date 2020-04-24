jest.mock('../../../handlers/net.js');
const Net = require('../../../handlers/net.js');

beforeEach(() => {
    Net.mockClear();
});

test("constructor of Net is called, returned, and the returned Object is Net", () => {
    const spy = jest.spyOn(Net.prototype, 'constructor');
    const mb = new Net();
    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveReturned();
    expect(mb.constructor).toBe(Net);
});

test("outgoingHandler method is called, and it has returned", () => {
    const spy = jest.spyOn(Net.prototype, 'outgoingHandler');
    const mb = new Net();
    mb.outgoingHandler();
    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveReturned();
});

test("listen method is called, and it has returned", () => {
    const spy = jest.spyOn(Net.prototype, 'listen');
    const mb = new Net();
    mb.listen();
    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveReturned();
});

test("searchForMatch method is called, and it has returned", () => {
    const spy = jest.spyOn(Net.prototype, 'searchForMatch');
    const mb = new Net();
    mb.searchForMatch();
    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveReturned();
});