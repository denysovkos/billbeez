const Server = require('./server');
const storage = require('./modules/dataStorage');

const app = new Server();

storage.initialize()
    .then(() => app.run())
    .catch(err => console.log('Main error: ', err));