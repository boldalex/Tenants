const express = require("express");

const FeedbacksController = require("../controllers/feedbacks");

const router = express.Router();

router.post("", FeedbacksController.createFeedback);

router.get("/:flatId", FeedbacksController.getFeedbacks);

module.exports = router;
