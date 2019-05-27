const express = require('express');
const Routes = require('./routes');

module.exports = class Server {
    constructor() {
        this.app = express();
        this.router = new Routes(this.app);
        this.router.setRoutes();
    }

    run() {
        this.app.listen(3000, () => {
            console.log('App started on port 3000');
        });
    }
}