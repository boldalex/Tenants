const Pool = require('pg').Pool;

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PWD,
  port: process.env.DB_PORT
});

const getAddresses = (req, res, next) => {
  query = 'SELECT address_id, street, property_number, longitude, latitude from addresses';
  pool.query(query,(error,results) => {
    if (error) {
      res.status(500).json({
        message: error
      });
    }else{
      res.status(200).json({
        message: 'successfull',
        addresses: results.rows
      });
    }
  });
}

const getAddress = (req, res, next) => {

}

module.exports = {getAddresses, getAddress};
