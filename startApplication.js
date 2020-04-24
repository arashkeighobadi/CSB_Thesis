const Application = require('./application.js');
const Net = require('./handlers/net.js');

const application = new Application();
const net = new Net(application);

net.listen();