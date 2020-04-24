jest.mock('../../../front-end/handlers/collisionHandler.js');
const CollisionHandler = require('../../../front-end/handlers/collisionHandler.js');

beforeEach(() => {
    CollisionHandler.mockClear();
});

test("constructor is called, returned, and the returned Object is CollisionHandler", () => {
    const spy = jest.spyOn(CollisionHandler.prototype, 'constructor');
    const mb = new CollisionHandler();
    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveReturned();
    expect(mb.constructor).toBe(CollisionHandler);
});

test("addCollider method is called, and it has returned", () => {
    const spy = jest.spyOn(CollisionHandler.prototype, 'addCollider');
    const mb = new CollisionHandler();
    mb.addCollider();
    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveReturned();
});

test("addOverlap method is called, and it has returned", () => {
    const spy = jest.spyOn(CollisionHandler.prototype, 'addOverlap');
    const mb = new CollisionHandler();
    mb.addOverlap();
    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveReturned();
});

test("playerBulletCollision method is called, and it has returned", () => {
    const spy = jest.spyOn(CollisionHandler.prototype, 'playerBulletCollision');
    const mb = new CollisionHandler();
    mb.playerBulletCollision();
    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveReturned();
});

test("bulletMapWallCollision method is called, and it has returned", () => {
    const spy = jest.spyOn(CollisionHandler.prototype, 'bulletMapWallCollision');
    const mb = new CollisionHandler();
    mb.bulletMapWallCollision();
    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveReturned();
});

test("bulletMapBoundCollision method is called, and it has returned", () => {
    const spy = jest.spyOn(CollisionHandler.prototype, 'bulletMapBoundCollision');
    const mb = new CollisionHandler();
    mb.bulletMapBoundCollision();
    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveReturned();
});

