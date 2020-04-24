const PlayGame = require('../../front-end/playGame.js');
jest.mock('../../front-end/playGame.js');

beforeEach(() => {
    PlayGame.mockClear();
});

test("constructor of PlayGame is called, returned, and the returned Object is PlayGame", () => {
    const spy = jest.spyOn(PlayGame.prototype, 'constructor');
    const mb = new PlayGame();
    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveReturned();
    expect(mb.constructor).toBe(PlayGame);
});

test("create method of PlayGame is called, and it has returned", () => {
    const spy = jest.spyOn(PlayGame.prototype, 'create');
    const mb = new PlayGame();
    mb.create();
    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveReturned();
});

test("update method of PlayGame is called, and it has returned", () => {
    const spy = jest.spyOn(PlayGame.prototype, 'update');
    const mb = new PlayGame();
    mb.update();
    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveReturned();
});


test("loadGame method of PlayGame is called, and it has returned", () => {
    const spy = jest.spyOn(PlayGame.prototype, 'loadGame');
    const mb = new PlayGame();
    mb.loadGame();
    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveReturned();
});

test("loadPlayers method of PlayGame is called, and it has returned", () => {
    const spy = jest.spyOn(PlayGame.prototype, 'loadPlayers');
    const mb = new PlayGame();
    mb.loadPlayers();
    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveReturned();
});

test("playerCollidesTarget method of PlayGame is called, and it has returned", () => {
    const spy = jest.spyOn(PlayGame.prototype, 'playerCollidesTarget');
    const mb = new PlayGame();
    mb.playerCollidesTarget();
    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveReturned();
});

test("playerWon method of PlayGame is called, and it has returned", () => {
    const spy = jest.spyOn(PlayGame.prototype, 'playerWon');
    const mb = new PlayGame();
    mb.playerWon();
    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveReturned();
});

test("playerLost method of PlayGame is called, and it has returned", () => {
    const spy = jest.spyOn(PlayGame.prototype, 'playerLost');
    const mb = new PlayGame();
    mb.playerLost();
    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveReturned();
});

test("handleMoveEvent method of PlayGame is called, and it has returned", () => {
    const spy = jest.spyOn(PlayGame.prototype, 'handleMoveEvent');
    const mb = new PlayGame();
    mb.handleMoveEvent();
    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveReturned();
});

test("emitMovement method of PlayGame is called, and it has returned", () => {
    const spy = jest.spyOn(PlayGame.prototype, 'emitMovement');
    const mb = new PlayGame();
    mb.emitMovement();
    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveReturned();
});
