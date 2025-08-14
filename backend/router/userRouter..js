const express = require("express");
const { viewquestions } = require("../controllers/user/viewquestions");
const { submit } = require("../controllers/user/submit");

const router = express.Router();

router.get('/viewquestions', viewquestions);
router.post("/submit", submit);

module.exports = router;
