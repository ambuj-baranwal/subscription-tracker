import { Conversation, Message, prisma } from "../config/prisma.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getConversations = asyncHandler(async (req, res) => {
  const conversations = await Conversation.findMany({
    where: {
      userId: req.user.id,
    },
    select: {
      id: true,
      title: true,
      updatedAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  res
    .status(200)
    .json(
      new ApiResponse(200, conversations, "Conversation fetched successfully"),
    );
});

const getConversation = asyncHandler(async (req, res) => {
  const { conversationId } = req.params;
  const conversation = await Conversation.findUnique({
    where: { id: conversationId, userId: req.user.id },
    include: {
      messages: {
        orderBy: { createdAt: "asc" },
      },
    },
  });
  if (!conversation) {
    return new ApiError(404, "Conversation not found");
  }
  res
    .status(200)
    .json(
      new ApiResponse(200, conversation, "Conversation fetched successfully"),
    );
});

const getConversationMessages = asyncHandler(async (req, res) => {
  const { conversationId } = req.params;

  const conversation = await prisma.conversation.findFirst({
    where: { id: conversationId, userId: req.user.id },
  });

  if (!conversation) {
    throw new ApiError(404, "Conversation not found");
  }

  const messages = await Message.findMany({
    where: {
      conversationId,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  return res.status(200).json(messages);
});

const createConversation = asyncHandler(async (req, res) => {
  const { title, messages = [] } = req.body;

  const newChat = await Conversation.create({
    data: {
      title: title,
      userId: req.user.id,
      messages: {
        create: messages,
      },
    },
    include: {
      messages: true,
    },
  });

  return res
    .status(201)
    .json(new ApiResponse(201, newChat, "Conversation created successfully"));
});

const addMessageToConversation = asyncHandler(async (req, res) => {
  const { conversationId } = req.params;
  const { role, content } = req.body;

  const conversation = await Conversation.findUnique({
    where: {
      id: conversationId,
      userId: req.user.id,
    },
  });
  if (!conversation) {
    throw new ApiError(404, "Conversation not found");
  }

  const newMessage = await Message.create({
    data: {
      role: role,
      content: content,
      conversationId: conversationId,
    },
  });

  res
    .status(201)
    .json(new ApiResponse(201, newMessage, "Message added successfully"));
});

const updateConversationTitle = asyncHandler(async (req, res) => {
  const { conversationId } = req.params;
  const { title } = req.body;
  if (!title) {
    throw new ApiError(404, "Title is required");
    // return res.status(400).json({ error: "Title is required" });
  }

  const conversation = await Conversation.findUnique({
    where: {
      id: conversationId,
      userId: req.user.id,
    },
  });
  if (!conversation) {
    throw new ApiError(404, "Conversation not found");
  }

  const updatedConversation = await Conversation.update({
    where: {
      id: conversationId,
    },
    data: { title },
    // include: { messages: true },
  });

  res
    .status(200)
    .json(new ApiResponse(200, updatedConversation, "Title updated"));
});

const deleteConversation = asyncHandler(async (req, res) => {
  const { conversationId } = req.params;
  await Conversation.delete({
    where: { id: conversationId },
  });

  res
    .status(201)
    .json(new ApiResponse(200, {}, "Conversation deleted successfully"));
  // .json({message: `Conversation ${conversationId} is deleted`});
});

const updateMessage = asyncHandler(async (req, res) => {
  const { conversationId, messageId } = req.params;
  const { content } = req.body;

  if (!content) {
    throw new ApiError(400, "Content is required");
  }

  const message = await Message.findUnique({
    where: {
      id: messageId,
      conversationId: conversationId,
      Conversation: {
        userId: req.user.id,
      },
    },
  });

  if (!message) {
    throw new ApiError(404, "Message not found");
  }

  const updatedMessage = await Message.update({
    where: {
      id: messageId,
    },
    data: { content },
  });

  res.status(200).json(new ApiResponse(200, updatedMessage, "Message updated"));
});

// Optional to delete a message
const deleteMessage = asyncHandler(async (req, res) => {
  const { conversationId, messageId } = req.params;

  await Message.delete({
    where: {
      id: messageId,
      conversationId,
      Conversation: { userId: req.user.id },
    },
  });

  res
    .status(200)
    .json(new ApiResponse(200, {}, "Message deleted successfully"));
  // .json(message: `Deleted ${messageId}`)
});

const searchConversation = asyncHandler(async (req, res) => {
  const { query } = req.query;
  if (!query) {
    throw new ApiError(400, "Search query is required");
  }

  const messages = await Message.findMany({
    where: {
      content: {
        contains: query,
        mode: "insensitive",
      },
      Conversation: {
        userId: req.user.id,
      },
    },
    include: {
      Conversation: {
        select: {
          id: true,
          title: true,
        },
      },
    },
    take: 20,
    orderBy: { createdAt: "desc" },
  });

  return res
    .status(200)
    .json(
      new ApiResponse(200, messages, "Search results fetched successfully"),
    );
});

export {
  getConversations,
  getConversation,
  getConversationMessages,
  createConversation,
  addMessageToConversation,
  updateConversationTitle,
  deleteConversation,
  updateMessage,
  deleteMessage,
  searchConversation,
};
