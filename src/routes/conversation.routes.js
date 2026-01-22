import { Router } from "express";
import {
  addMessageToConversation,
  createConversation,
  deleteConversation,
  deleteMessage,
  getConversation,
  getConversationMessages,
  getConversations,
  searchConversation,
  updateConversationTitle,
  updateMessage,
} from "../controllers/conversation.controller.js";

const router = Router();

router.get("/", getConversations);

router.post("/", createConversation);

router.get("/:conversationId", getConversation);

// To update title
router.put("/:conversationId", updateConversationTitle);

router.delete("/:conversationId", deleteConversation);

router.get("/:conversationId/messages", getConversationMessages);

router.post("/:conversationId/messages", addMessageToConversation);

router.put("/:conversationId/messages/:messageId", updateMessage);

// Optional route to delete a message
router.delete("/:conversationId/messages/:messageId", deleteMessage);

router.get("/search", searchConversation);

export default router;
