const express = require("express")
const router = express.Router()
const { registerUser, authUser, allUsers } = require("../controllers/userController")
const {protect} = require("../middlewares/userMiddleware")

router.route("/").post(registerUser).get(protect,allUsers)
router.post('/login',authUser)


module.exports = router;