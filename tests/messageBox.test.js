jest.mock('../front-end/GUI/messageBox.js');
const MessageBox = require('../front-end/GUI/messageBox.js');

beforeEach(() => {
    MessageBox.mockClear();
});

test("constructor is called, returned, and the returned Object is MessageBox", () => {
    const spy = jest.spyOn(MessageBox.prototype, 'constructor');
    spy.mockImplementation(() => {});
    const mb = new MessageBox();
    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveReturned();
    expect(mb.constructor).toBe(MessageBox);
});

test("addButton method is called, and it has returned", () => {
    const spy = jest.spyOn(MessageBox.prototype, 'addButton');
    spy.mockImplementation(() => {});
    // MessageBox.prototype.addButton()
    const mb = new MessageBox();
    mb.addButton();
    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveReturned();
});

test("hideBox method is called, and it has returned", () => {
    const spy = jest.spyOn(MessageBox.prototype, 'hideBox');
    spy.mockImplementation(() => {});
    const mb = new MessageBox();
    mb.hideBox();
    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveReturned();
});

