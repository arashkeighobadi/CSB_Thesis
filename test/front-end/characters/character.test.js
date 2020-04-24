jest.mock('../../../front-end/characters/character.js');
const Character = require('../../../front-end/characters/character.js');

beforeEach(() => {
    Character.mockClear();
});

test("constructor is called, returned, and the returned Object is Character", () => {
    const spy = jest.spyOn(Character.prototype, 'constructor');
    const mb = new Character();
    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveReturned();
    expect(mb.constructor).toBe(Character);
});