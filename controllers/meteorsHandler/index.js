const storage = require('../../modules/dataStorage');

module.exports = async (req, res) => {
    let data = [];
    const { year, mass } = req.query;
    try {
        if (!year && !mass) {
            data = await storage.query(`SELECT * FROM meteors`);
        } else if (year && !mass) {
            data = await storage.query(`SELECT * FROM meteors WHERE year=${year}`);
            if (!data.length) {
                data = await storage.query(`SELECT * FROM meteors WHERE year=(SELECT year FROM meteors WHERE year<${year} ORDER BY year DESC LIMIT 1) ORDER BY year DESC `);
            }
        } else if (mass && !year) {
            data = await storage.query(`SELECT * FROM meteors WHERE mass=${mass}`);
            if (!data.length) {
                data = await storage.query(`SELECT * FROM meteors WHERE mass=(SELECT mass FROM meteors WHERE mass<${mass} ORDER BY mass DESC LIMIT 1) ORDER BY mass DESC `);
            }
        } else {
            data = await storage.query(`SELECT * FROM meteors WHERE year=${year} AND mass=${mass}`);
            if (!data.length) {
                data = await storage.query(`SELECT * FROM meteors WHERE year=(SELECT year FROM meteors WHERE year<${year} ORDER BY year DESC LIMIT 1) AND mass=(SELECT mass FROM meteors WHERE mass<${mass} ORDER BY mass DESC LIMIT 1) ORDER BY mass DESC `);
            }
        }
    
        res.send(data);
    } catch(err) {
        res.status(500).send({err});
    }
}