const PlayerS = require('../../../characters/playerS.js');
jest.mock('../../../characters/playerS.js');

beforeEach(() => {
    PlayerS.mockClear();
});

test("constructor of PlayerS is called, returned, and the returned Object is PlayerS", () => {
    const spy = jest.spyOn(PlayerS.prototype, 'constructor');
    const mb = new PlayerS();
    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveReturned();
    expect(mb.constructor).toBe(PlayerS);
});