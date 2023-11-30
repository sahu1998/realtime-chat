const express = require("express");
const { verifyUser } = require("../middleware/auth.middleware");
const router = express.Router();
const messageController = require('../controller/message.controller')

router.route("/").post(verifyUser, messageController.sendMessage)

// fetch all message for one single chat
router.route("/:chatId").get(verifyUser, messageController.allMessages)


module.exports = router;
