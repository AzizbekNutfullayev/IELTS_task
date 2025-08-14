const express = require("express");
const { login } = require("../controllers/admin/login");
const { signup } = require("../controllers/admin/signup");
const { addquestions } = require("../controllers/admin/addquestions");
const { getquestions } = require("../controllers/admin/getquestions");
const { delate } = require("../controllers/admin/delate");
const { updateQuestion } = require("../controllers/admin/updateQuestion");
const router = express.Router();

router.post('/login', login);
router.post('/signup', signup);
router.post("/questions", addquestions);
router.get('/getquestions', getquestions)
router.delete('/delete/:id',delate)
router.put("/updatequestion/:id", updateQuestion);



module.exports = router;    
