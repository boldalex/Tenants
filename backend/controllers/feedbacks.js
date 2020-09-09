const Pool = require("pg").Pool;

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PWD,
  port: process.env.DB_PORT,
});

const createFeedback = (req,res,next) => {
  query = `INSERT INTO feedbacks (flat_id,user_id,feedback_date,neighborhood_r,neighborhood_c,flat_r,flat_c,
    location_r,location_c,owner_r,owner_c,infrastructure_r,infrastructure_c,general_c) VALUES
    ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)`;
  parameters = [
    req.body.flatId,req.body.userId,req.body.feedbackDate,req.body.neighborhood_r,req.body.neighborhood_c,
    req.body.flat_r,req.body.flat_c,req.body.location_r,req.body.location_c,req.body.owner_r,req.body.owner_c,
    req.body.infrastructure_r,req.body.infrastructure_c,req.body.general_c
  ];
  pool.query(query,parameters,(error,results) => {
    if (error) {
      res.status(500).json({
        message: error,
      });
    }
    res.status(201).json({ message: "Feedback created" });
  });
}

const getFeedbacks = (req,res,next) => {
  query = `SELECT u.username, f.feedback_date, neighborhood_r, neighborhood_c, flat_r, flat_c, location_r,
    location_c, owner_r, owner_c, infrastructure_r, infrastructure_c, general_c,
    (neighborhood_r + flat_r + location_r + owner_r + infrastructure_r)::decimal/5 general_r
    FROM feedbacks f JOIN users u ON (f.user_id = u.user_id)
    WHERE f.flat_id = $1`;
  pool.query(query,[req.params.flatId],(error,results) => {
    if (error) {
      res.status(500).json({
        message: error
      });
    }else{
      res.status(200).json(results.rows);
    }

  })

}

module.exports = {createFeedback, getFeedbacks};
