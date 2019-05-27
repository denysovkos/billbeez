const meteorsHandler = require('../../controllers/meteorsHandler');

module.exports = class Routes {
    constructor(app) {
        this.app = app;
    }

    setRoutes() {
        this.app.get('/meteors', meteorsHandler);
    }

}