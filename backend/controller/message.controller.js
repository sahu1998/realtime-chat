const Chat = require("../models/chat.model");
const Message = require("../models/message.model");
const User = require("../models/user.model");

module.exports = {
  sendMessage: async (req, res) => {
    const { content, chatId } = req.body;

    if (!content || !chatId) {
      console.log("Invalid data passed into request");
      return res.sendStatus(400);
    }

    let newMessage = {
      sender: req.user._id,
      content,
      chat: chatId,
    };

    try {
      let message = await Message.create(newMessage);
      message = await message.populate("sender", "name image");
      message = await message.populate("chat");
      message = await User.populate(message, {
        path: "chat.users",
        select: "name email image",
      });

      await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: message });
      res.send(message);
    } catch (error) {
      res.status(400).send({ message: error.message });
    }
  },

  allMessages: async (req, res) => {
    try {
      const messages = await Message.find({ chat: req.params.chatId })
        .populate("sender", "name image email")
        .populate("chat");
      res.send(messages);
    } catch (error) {
      res.status(400).send({ message: error.message });
    }
  },
};
