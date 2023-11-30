const express = require("express");
const { verifyUser } = require("../middleware/auth.middleware");
const chatController = require("../controller/chat.controller");
const router = express.Router();

router
  .route("/")
  .post(verifyUser, chatController.accessChat)
  .get(verifyUser, chatController.fetchChats);

router.route("/create-group").post(verifyUser, chatController.createGroupChat);

router.route("/rename-group").put(verifyUser, chatController.renameGroup);

router.route("/remove-user-from-group").put(verifyUser, chatController.removeUserFromGroup);

router.route("/add-user-in-group").put(verifyUser, chatController.addUserInGroup);
module.exports = router;
