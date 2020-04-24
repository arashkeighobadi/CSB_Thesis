const PreloadGame = require('../../front-end/preloadGame.js');
jest.mock('../../front-end/preloadGame.js');

beforeEach(() => {
    PreloadGame.mockClear();
});

test("constructor of PreloadGame is called, returned, and the returned Object is PreloadGame", () => {
    const spy = jest.spyOn(PreloadGame.prototype, 'constructor');
    const mb = new PreloadGame();
    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveReturned();
    expect(mb.constructor).toBe(PreloadGame);
});


test("create method of PreloadGame is called, and it has returned", () => {
    const spy = jest.spyOn(PreloadGame.prototype, 'create');
    const mb = new PreloadGame();
    mb.create();
    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveReturned();
});
