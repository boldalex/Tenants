const { query } = require("express");

const Pool = require("pg").Pool;

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PWD,
  port: process.env.DB_PORT,
});

const createFlat = (req, res, next) => {
  const checkId = () => {
    if (req.body.addressId) {
      return pool.query(
        "SELECT * FROM addresses WHERE address_id = $1",
        [req.body.addressId])
        .then((results) => {
          if (results.rowCount === 0) {
            res
              .status(404)
              .json({ message: "Address doesn't exist in database!" });
          }else{
            return req.body.addressId;
          }
        })
        .catch((error) => {
          res.status(500).json({
            message: error,
            location: "first request"
          });
        });
    }else {
      parameters = [req.body.fullAddress,req.body.longitude,req.body.latitude];
      return pool.query(`INSERT INTO addresses (full_address,longitude,latitude)
      VALUES ($1,$2,$3) RETURNING *`,parameters)
        .then((results) => {return results.rows[0].address_id})
        .catch((error) => {
          res.status(500).json({
            message: error
          });
        });
    }
  }
  checkId().then((validId) => {
    if (validId){
      let flatData = {
        addressId: validId,
        flatId: null
      }
      return pool.query(
        "SELECT flat_id from flats WHERE address_id = $1 and flat_number = $2",
        [validId, req.body.flatNumber])
        .then((results) => {
          if (results.rowCount > 0){
            flatData.flatId = results.rows[0].flat_id
          }
            return flatData;
        }).catch((error) => {
          res.status(500).json({
            message: error,
          });
        });
    }
  }).then((flat)=>{
    if (flat){
      if (flat.flatId == null) {
        pool.query(
          "INSERT INTO flats (address_id,flat_number) VALUES ($1,$2) RETURNING *",
          [flat.addressId, req.body.flatNumber],
          (error, results) => {
            if (error) {
              return res.status(500).json({
                message: error,
              });
            }else{
              res.status(201).json({ message: "Flat created", flatId: results.rows[0].flat_id });
            }
          }
        );
      }else{
        res.status(200).json({message: "Flat already exists", flatId: flat.flatId});
      }
    }
  });

}

const getFlats = (req, res, next) => {
  text = `select fl.flat_id, concat(a.city,' ул. ',a.street,' ',p.property_type ,' ',a.property_number) full_address,
    a.longitude, a.latitude, fl.flat_number, r.neighborhood_r, r.flat_r, r.location_r, r.owner_r,
    r.infrastructure_r, r.general_r
    from flats fl full join (
    SELECT f.flat_id, avg(f.neighborhood_r) neighborhood_r, avg(f.flat_r) flat_r, avg(f.location_r) location_r,
    avg(f.owner_r) owner_r, avg(f.infrastructure_r) infrastructure_r, avg(f.general_r) general_r from (
    select flat_id, neighborhood_r, flat_r, location_r,
    owner_r, infrastructure_r, (neighborhood_r + flat_r + location_r + owner_r + infrastructure_r)::decimal/5 general_r
    from feedbacks) as f
    group by flat_id
    ) as r on (fl.flat_id = r.flat_id)
    join addresses a on (fl.address_id = a.address_id )
    join property_types p on (a.property_type_id = p.property_type_id)`;
  pool.query(text, (error, results) => {
    if (error) {
      res.status(500).json({
        message: error,
      });
    }
    res.status(200).json(results.rows);
  });
};

// const getFlatsByAddress = (req, res, next) => {
//   text = `select fl.flat_id, a.full_address,
//     a.longitude, a.latitude, fl.flat_number, r.neighborhood_r, r.flat_r, r.location_r, r.owner_r,
//     r.infrastructure_r, r.general_r
//     from flats fl join (
//     SELECT f.flat_id, avg(f.neighborhood_r) neighborhood_r, avg(f.flat_r) flat_r, avg(f.location_r) location_r,
//     avg(f.owner_r) owner_r, avg(f.infrastructure_r) infrastructure_r, avg(f.general_r) general_r from (
//     select flat_id, neighborhood_r, flat_r, location_r,
//     owner_r, infrastructure_r, (neighborhood_r + flat_r + location_r + owner_r + infrastructure_r)::decimal/5 general_r
//     from feedbacks) as f
//     group by flat_id
//     ) as r on (fl.flat_id = r.flat_id)
//     join (
//     select address_id, concat(city,' ',street,' ',property_number) full_address, longitude, latitude, property_type_id
//     from addresses) as a on (fl.address_id = a.address_id )
//     join property_types p on (a.property_type_id = p.property_type_id)
//     where a.full_address like $1`;
//   pool.query(text,['%' + req.params.search + '%'],(error,results) => {
//     if (error) {
//       res.status(500).json({
//         message: error,
//       });
//     }
//     res.status(200).json(results.rows);
//   });
// };

const getFlatsByAddress = (req, res, next) => {
  text = `select fl.flat_id, fl.address_id, fl.flat_number, r.general_r
  from flats fl full join (
  SELECT f.flat_id, avg(f.general_r) general_r from (
  select flat_id, (neighborhood_r + flat_r + location_r + owner_r + infrastructure_r)::decimal/5 general_r
  from feedbacks) as f
  group by flat_id
  ) as r on (fl.flat_id = r.flat_id)
  where fl.address_id = $1`;
  pool.query(text,[req.params.addressId],(error,results) => {
    if (error) {
      res.status(500).json({
        message: error,
      });
    }
    res.status(200).json({
      message: 'success',
       flats: results.rows});

  });
};

const getUnit = (req, res, next) => {
  text = `select a.address_id, a.full_address, a.longitude, a.latitude, fl.flat_id, fl.flat_number, r.general_r
  from flats fl full join (
  SELECT f.flat_id, avg(f.general_r) general_r from (
  select flat_id, (neighborhood_r + flat_r + location_r + owner_r + infrastructure_r)::decimal/5 general_r
  from feedbacks) as f
  group by flat_id
  ) as r on (fl.flat_id = r.flat_id)
  full join addresses a on (fl.address_id = a.address_id)
  where fl.flat_id = $1`;
  pool.query(text,[req.params.flatId],(error,results) => {
    if (error) {
      res.status(500).json({
        message: error,
      });
    }
    res.status(200).json({
      message: 'success',
      unit: results.rows[0]});

  });
};

module.exports = {
  createFlat,
  getFlats,
  getFlatsByAddress,
  getUnit
};
