const Pool = require('pg').Pool;
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PWD,
  port: process.env.DB_PORT
});

const createUser = (req, res, next) => {
  bcrypt.hash(req.body.password, 10).then(hash => {
    pool.query('INSERT INTO users (email,username,passhash) VALUES ($1,$2,$3)',
      [req.body.email,req.body.username,hash], (error, results) => {
      if (error){
        res.status(500).json({
          message: error
        });
      }
      res.status(201).json({message:'User created', email: req.body.email, username: req.body.username, hash: hash});
    });
  });
}

const userLogin = (req, res, next) => {
  pool.query('SELECT * FROM users WHERE email = $1',[req.body.email], (error,result) => {
    if (error) {
      res.status(500).json({
        message: "Auth failed!"
      });
    }
    if (result.rowCount === 0){
      res.status(401).json({
        message: "Invalid authentication credentials!"
      });
    }
    bcrypt.compare(req.body.password, result.rows[0].passhash).then((compare) => {
      if(!compare){
        res.status(401).json({
          message: "Invalid authentication credentials!"
        });
      }
      const token = jwt.sign(
        {
          email: result.rows[0].email,
          userName: result.rows[0].username
        }, process.env.JWT_KEY, {expiresIn: "1h"}
      );
      res.status(200).json({
        token: token,
        expiresIn: 3600,
        userId: result.rows[0].user_id
      });
    });
  });
}

module.exports = {createUser, userLogin};

