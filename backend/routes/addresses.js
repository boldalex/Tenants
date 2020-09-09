const express = require("express");

const AddressesController = require("../controllers/addresses");

const router = express.Router();

router.get("", AddressesController.getAddresses);

router.get("/:search", AddressesController.getAddress);

module.exports = router;
