import {prisma} from "../config/prisma.js";

const getConversations = async (req, res) => {
  try {
    const conversations = await prisma.conversation.findMany({
      where: {
        userId: req.user.id,
      },
      select: {
        id: true,
        title: true,
        messages: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json(conversations);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch conversations" });
  }
};

const getConversation = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId, userId: req.user.id },
      include: { messages: true },
    });
    if (!conversation) {
      return res.status(404).json({ error: "Conversation not found" });
    }
    res.status(200).json(conversation);
  } catch (error) {
    console.log(error);
    return res
        .status(500)
        .json({ error: `Failed to fetch conversation : ${conversationId} ` });
  }
};

const getConversationMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;

    const messages = await prisma.message.findMany({
      where: {
        conversationId,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    return res.status(200).json(messages);
  } catch (error) {
    console.error("Failed to fetch messages :", error);
    return res.status(500).json({ error: "Failed to fetch messages" });
  }
};

const createConversation = async (req, res) => {
  try {
    const { title, messages } = req.body;

    const newChat = await prisma.conversation.create({
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

    return res.status(201).json(newChat);
  } catch (error) {
      console.log(`Failed to create a new chat : ${error}`)
    return res.status(500).json({ error: `Failed to create a new chat : ${error}` });
  }
};

const addMessageToConversation = async (req, res) => {
  try {
    const { conversationId } = req.params;

    const { role, content } = req.body;

    const newMessage = await prisma.message.create({
      data: {
        role: role,
        content: content,
        conversationId: conversationId,
      },
    });

    res.status(201).json(newMessage);
  } catch (error) {
    console.error("Failed to add message:", error);
    res.status(500).json({ error: "Failed to add message to conversation" });
  }
};

const updateConversationTitle = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { title } = req.body;
    if (!title) {
      return res.status(400).json({ error: "Title is required" });
    }
    const updatedConversation = await prisma.conversation.update({
      where: {
        id: conversationId,
      },
      data: { title },
      include: { messages: true },
    });

    res.status(200).json(updatedConversation);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: `Failed to update conversation title : ${conversationId} `,
    });
  }
};

const deleteConversation = async (req, res) => {
  try {
    const { conversationId } = req.params;
    await prisma.conversation.delete({
      where: { id: conversationId },
    });

    res.status(204).send();
    // .json({message: `Conversation ${conversationId} is deleted`});
  } catch (error) {
    console.log("Failed to delete conversation", error);
    res
      .status(500)
      .json({ error: `Failed to delete conversation : ${conversationId} ` });
  }
};

const updateMessage = async (req, res) => {
  try {
    const { conversationId, messageId } = req.params;
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ error: "Content is required" });
    }

    const message = await prisma.message.findUnique({
      where: { id: messageId },
    });

    if (!message || message.conversationId !== conversationId) {
      return res
        .status(404)
        .json({ error: "Message not found in conversation" });
    }

    const updatedMessage = await prisma.message.update({
      where: {
        id: messageId,
      },
      data: { content },
    });

    res.status(200).json(updatedMessage);
  } catch (error) {
    console.error(`Failed to update message : ${error}`);
    res.status(500).json({ error: `Failed to update message : ${error}` });
  }
};

// Optional to delete a message
const deleteMessage = async (req, res) => {
  try {
    const { conversationId, messageId } = req.params;

    await prisma.message.delete({
      where: {
        id: messageId,
        conversationId,
      },
    });

    res.status(204).send();
    // .json(message: `Deleted ${messageId}`)
  } catch (error) {
    console.error(`Failed to delete message : ${error}`);
    res.status(500).json({ error: `Failed to delete message : ${error}` });
  }
};


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
}
