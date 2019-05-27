const sqlite3 = require('sqlite3').verbose();
const fetch = require('node-fetch');

class DataStorage {
    constructor() {
        this.db = null
    }

    initialize() {
        return new Promise((resolve, reject) => {
            this.db = new sqlite3.Database(':memory:', (err) => {
                if (err) {
                  return console.error(err.message);
                }
    
                console.log('Connected to the in-memory SQlite database.');
            });

            this.db.run(`CREATE TABLE IF NOT EXISTS meteors (name TEXT, id TEXT, recclass TEXT, mass INTEGER, fall TEXT, year INTEGER)`);

            fetch('https://data.nasa.gov/resource/y77d-th95.json')
                    .then(res => res.json())
                    .then(json => this.dbFiller(json))
                    .then(() => resolve(true))
                    .catch(err => {
                        console.log('Error while fetching data', err);
                        reject(err);
                    }); 
        });
    }

    dbFiller(data) {
        try {
            data.map((obj) => {
                if (!obj.year || !obj.mass) return;

                const preparedData = {
                    name: obj.name,
                    id: obj.id || null,
                    recclass: obj.recclass,
                    mass: obj.mass,
                    fall: Number(obj.fall),
                    year: Number(obj.year.slice(0, 4))
                };

                const cols = Object.keys(preparedData).join(", ");
                const placeholders = Object.keys(preparedData).fill('?').join(", ");
                this.db.run('INSERT INTO meteors (' + cols + ') VALUES (' + placeholders + ')', Object.values(preparedData));
            });
        } catch (err) {
            console.log('Error while inserting data', err);
        }
    }

    query(q) {
        return new Promise((resolve, reject) => {
            if (!q || typeof q !== 'string') {
                reject('wrong query');
            }
            this.db.all(q, function(err, data) {
                if (err) {
                    console.log('ERROR IN QUERY > ', err);
                    reject(err)
                }

                resolve(data);
            });
        })
    }
}

module.exports = new DataStorage();