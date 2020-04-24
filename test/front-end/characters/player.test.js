jest.mock('../../../front-end/characters/player.js');
const Player = require('../../../front-end/characters/player.js');

beforeEach(() => {
    Player.mockClear();
});

test("constructor is called, returned, and the returned Object is Player", () => {
    const spy = jest.spyOn(Player.prototype, 'constructor');
    const mb = new Player();
    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveReturned();
    expect(mb.constructor).toBe(Player);
});

test("scoreUp method is called, and it has returned", () => {
    const spy = jest.spyOn(Player.prototype, 'scoreUp');
    const mb = new Player();
    mb.scoreUp();
    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveReturned();
});

test("get_xVelocity method is called, and it has returned", () => {
    const spy = jest.spyOn(Player.prototype, 'get_xVelocity');
    const mb = new Player();
    mb.get_xVelocity();
    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveReturned();
});

test("get_yVelocity method is called, and it has returned", () => {
    const spy = jest.spyOn(Player.prototype, 'get_yVelocity');
    const mb = new Player();
    mb.get_yVelocity();
    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveReturned();
});

test("getX method is called, and it has returned", () => {
    const spy = jest.spyOn(Player.prototype, 'getX');
    const mb = new Player();
    mb.getX();
    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveReturned();
});

test("getY method is called, and it has returned", () => {
    const spy = jest.spyOn(Player.prototype, 'getY');
    const mb = new Player();
    mb.getY();
    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveReturned();
});