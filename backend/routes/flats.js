const express = require("express");

const FlatsController = require("../controllers/flats");

const router = express.Router();

router.post("", FlatsController.createFlat);

router.get("", FlatsController.getFlats);

router.get("/:addressId", FlatsController.getFlatsByAddress);

router.get("/unit/:flatId", FlatsController.getUnit);

module.exports = router;
