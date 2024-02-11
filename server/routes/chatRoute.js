const express = require("express")
const router = express.Router()
const {accessChat,fetchChats,groupChats,renameGroup,addUserToGroup,removeUserInGroup} = require("../controllers/chatController");
const { protect } = require("../middlewares/userMiddleware");

router.route("/").post(protect, accessChat)
router.route("/").get(protect, fetchChats);
router.route("/group").post(protect, groupChats);
router.route("/rename").put(protect, renameGroup)
router.route("/adduser").put(protect, addUserToGroup);
router.route("/deleteuser").put(protect, removeUserInGroup);


module.exports = router;