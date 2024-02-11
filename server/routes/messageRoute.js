const { sendMessage,allMessages } = require('../controllers/messageController')

const express = require('express')
const router = express.Router();

const {protect} = require("../middlewares/userMiddleware")

router.route("/").post(protect, sendMessage)

router.route("/allmessages/:chatId").get(protect,allMessages)

module.exports = router