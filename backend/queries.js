const Pool = require('pg').Pool;
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PWD,
  port: process.env.DB_PORT
});

const getAdmAreas = (req, res, next) => {
  pool.query('SELECT * FROM adm_areas', (error, results) => {
    if (error){
      throw error;
    }
    res.status(200).json(results.rows);
  });
}

const createArea = (req, res, next) => {
  const area = request.params.area;
  pool.query('INSERT INTO adm_areas (adm_area) VALUES ($1)',[area], (error, results) => {
    if (error){
      throw error;
    }
    res.status(200).send('Record was created');
  });
}

module.exports = {getAdmAreas};
