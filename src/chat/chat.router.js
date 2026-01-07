import express from "express";
import init from "./chat.provider.js";

export const chatRouter = express.Router();

const { chatController } = init.controllers;
const { isAuthenticated } = init.middlewares;
const {
    getMessageValidator,
    sendMessageValidator,
    readMessageValidator,
    loadChatValidator,
    deleteChatValidator,
    deleteMessageValidator,
} = init.validators;

chatRouter.use(isAuthenticated);

chatRouter.get("/", chatController.loadChats);

chatRouter.post("/dm", loadChatValidator, chatController.loadChat);

chatRouter.get(
    "/:chatId/messages",
    getMessageValidator,
    chatController.getMessages
);

chatRouter.post(
    "/:chatId/messages",
    sendMessageValidator,
    chatController.sendMessage
);

chatRouter.post(
    "/:chatId/read",
    readMessageValidator,
    chatController.readMessage
);

chatRouter.delete(
    "/:chatId/messages/:messageId",
    deleteMessageValidator,
    chatController.deleteMessage
);

chatRouter.delete("/:chatId", deleteChatValidator, chatController.deleteChat);
