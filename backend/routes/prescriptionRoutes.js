const express = require("express");
const router = express.Router();

const { createPrescription } = require("../controllers/prescriptionController");
const { protect } = require("../middleware/authMiddleware");

router.post("/create", protect, createPrescription);

module.exports = router;