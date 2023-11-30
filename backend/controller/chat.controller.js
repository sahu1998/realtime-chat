const Chat = require("../models/chat.model");
const User = require("../models/user.model");

module.exports = {
  // responsible for creating and accessing one on one chat...
  accessChat: async (req, res) => {
    const { userId } = req.body;

    if (!userId) {
      console.log("UserId param not sent with request");
      return res.sendStatus(400);
    }

    let isChat = await Chat.find({
      isGroupChat: false,
      $and: [
        { users: { $elemMatch: { $eq: req.user._id } } },
        { users: { $elemMatch: { $eq: userId } } },
      ],
    })
      .populate("users", "-password")
      .populate("latestMessage");

    isChat = await User.populate(isChat, {
      path: "latestMessage.sender",
      select: "name image email",
    });

    if (isChat.length > 0) {
      res.send(isChat[0]);
    } else {
      let chatData = {
        chatName: "sender",
        isGroupChat: false,
        users: [req.user._id, userId],
      };

      try {
        const createdChat = await Chat.create(chatData);
        const fullChat = await Chat.findOne({ _id: createdChat._id }).populate(
          "users",
          "-password"
        );
        res.send(fullChat);
      } catch (error) {
        res.status(400).send({ error: error.message });
      }
    }
  },

  fetchChats: async (req, res) => {
    try {
      let chat = await Chat.find({
        users: { $elemMatch: { $eq: req.user._id } },
      })
        .populate("users", "-password")
        .populate("groupAdmin", "-password")
        .populate("latestMessage")
        .sort({ updatedAt: -1 });
      chat = await User.populate(chat, {
        path: "latestMessage.sender",
        select: "name image email",
      });
      res.send(chat);
    } catch (error) {
      res.status(400).send({ message: error.message });
    }
  },

  createGroupChat: async (req, res) => {
    const { users, chatName } = req.body;
    if (!users || !chatName) {
      return res.status(400).send({ message: "Please fill all the fields" });
    }

    if (users.length < 1) {
      return res
        .status(400)
        .send({ message: "More than 2 members are required" });
    }

    users.push(req.user._id);

    try {
      const groupChat = await Chat.create({
        chatName,
        users,
        isGroupChat: true,
        groupAdmin: req.user._id,
      });

      const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
        .populate("users", "-password")
        .populate("groupAdmin", "-password");

      res.send(fullGroupChat);
    } catch (error) {
      res.status(400).send({ message: error.message });
    }
  },

  renameGroup: async (req, res) => {
    const { groupId, chatName } = req.body;

    const updateGroup = await Chat.findByIdAndUpdate(
      groupId,
      { chatName },
      { new: true }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    if (!updateGroup) {
      res.status(400).send({ message: "Chat Not Found" });
    } else {
      res.send(updateGroup);
    }
  },

  removeUserFromGroup: async (req, res) => {
    const { chatId, userId } = req.body;

    try {
      const removedUser = await Chat.findByIdAndUpdate(
        chatId,
        { $pull: { users: userId } },
        { new: true }
      )
        .populate("users", "-password")
        .populate("groupAdmin", "-password");
      if (!removedUser) {
        res.status(400).send("Chat not found");
      } else {
        res.send(removedUser);
      }
    } catch (error) {
      res.status(400).send({ message: error.message });
    }
  },
  addUserInGroup: async (req, res) => {
    const { chatId, userId } = req.body;

    try {
      const addedUser = await Chat.findByIdAndUpdate(
        chatId,
        { $push: { users: userId } },
        { new: true }
      )
        .populate("users", "-password")
        .populate("groupAdmin", "-password");
      if (!addedUser) {
        res.status(400).send("Chat not found");
      } else {
        res.send(addedUser);
      }
    } catch (error) {
      res.status(400).send({ message: error.message });
    }
  },
};
