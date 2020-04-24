const CharacterS = require('../../../characters/characterS.js');
jest.mock('../../../characters/characterS.js');

beforeEach(() => {
    CharacterS.mockClear();
});

test("constructor of CharacterS is called, returned, and the returned Object is CharacterS", () => {
    const spy = jest.spyOn(CharacterS.prototype, 'constructor');
    const mb = new CharacterS();
    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveReturned();
    expect(mb.constructor).toBe(CharacterS);
});