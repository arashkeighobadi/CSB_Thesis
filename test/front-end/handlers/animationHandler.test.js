jest.mock('../../../front-end/handlers/animationHandler.js');
const AnimationHandler = require('../../../front-end/handlers/animationHandler.js');

beforeEach(() => {
    AnimationHandler.mockClear();
});

test("constructor is called, returned, and the returned Object is XXXXX", () => {
    const spy = jest.spyOn(AnimationHandler.prototype, 'constructor');
    spy.mockImplementation(() => {});
    const mb = new AnimationHandler();
    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveReturned();
    expect(mb.constructor).toBe(AnimationHandler);
});

test("play method is called, and it has returned", () => {
    const spy = jest.spyOn(AnimationHandler.prototype, 'play');
    const mb = new AnimationHandler();
    mb.play();
    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveReturned();
});

test("stop method is called, and it has returned", () => {
    const spy = jest.spyOn(AnimationHandler.prototype, 'stop');
    const mb = new AnimationHandler();
    mb.stop();
    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveReturned();
});

test("createAnimations method is called, and it has returned", () => {
    const spy = jest.spyOn(AnimationHandler.prototype, 'createAnimations');
    const mb = new AnimationHandler();
    mb.createAnimations();
    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveReturned();
});

