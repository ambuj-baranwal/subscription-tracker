import { Reminder, Subscription } from "../config/prisma.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {
  calculateNextReminderTime,
} from "../utils/dateHandler.utils.js";
import { ApiError } from "../utils/ApiError.js";

const getAllReminders = async (req, res) => {
  try {
    const Id = req.user.id; // getting through auth middleware
    const reminders = await Reminder.findMany({
      where: { userId: Id },
      include: {
        subscription: {
          select: {
            name: true,
            renewalDate: true,
          },
        },
      },
      orderBy: { createdAt: "asc" },
    });

    return res
      .status(200)
      .json(new ApiResponse(200, reminders, "Fetched all reminders"));
  } catch (error) {
    console.log(error);
    throw new ApiError(500, "Failed to get all reminders");
  }
};

const createReminder = async (req, res) => {
  try {
    const subscriptionId = req.params.subscriptionId || req.body.subscriptionId;
    let { type = "email", payload = {}, daysBefore = 1, sendAt } = req.body;

    const subscription = await Subscription.findUnique({
      where: { userId: req.user.id, id: subscriptionId },
      select: { frequency: true, renewalDate: true },
    });
    if (!subscription) {
      throw new ApiError(404, "No subscription found for this reminder");
    }
    if (!sendAt) {
      sendAt = calculateNextReminderTime(subscription.renewalDate, daysBefore);
    }

    const reminder = await Reminder.create({
      data: {
        userId: req.user.id,
        subscriptionId: subscriptionId,
        type: type,
        payload: payload,
        sendAt: sendAt,
      },
    });

    return res
      .status(200)
      .json(new ApiResponse(201, reminder, "Reminder created successfully"));
  } catch (error) {
    console.log("Failed to create Reminder", error);
    throw new ApiError(404, "Failed to create Reminder");
  }
};

const getReminderById = async (req, res) => {
  try {
    const { id: reminderId } = req.params;
    const reminder = await Reminder.findUnique({
      where: { id: reminderId, userId: req.user.id },
      include: { subscription: true },
    });

    return res
      .status(200)
      .json(new ApiResponse(200, reminder, "Fetched reminder"));
  } catch (error) {
    console.log("Failed to fetch reminder", error);
    throw new ApiError(404, "Failed to fetch reminder");
  }
};

const updateReminder = async (req, res) => {
  try {
    let {
      type,
      payload = {},
      enabled,
      daysBefore = 1,
      timezone = "UTC",
      sendAt,
    } = req.body;
    const { subscriptionId, id: reminderId } = req.params;

    // sendAt = calculateNextCycleDate(scheduleType);
    const updatedReminder = await Reminder.update({
      where: {
        id: reminderId,
        subscriptionId: subscriptionId,
        userId: req.user.id,
      },
      data: {
        type: type,
        payload: payload,
        daysBefore: daysBefore,
        enabled: enabled,
        timezone: timezone,
        sendAt: sendAt,
      },
    });
    return res
      .status(201)
      .json(
        new ApiResponse(201, updatedReminder, "Reminder updated successfully")
      );
  } catch (error) {
    console.log("Failed to update Reminders", error);
    throw new ApiError(404, "Failed to update Reminder");
  }
};

const deleteReminder = async (req, res) => {
  try {
    const { id: reminderId } = req.params;
    const Id = req.user.id;
    await Reminder.delete({
      where: { id: reminderId, userId: Id },
    });
    return res.status(204).json(new ApiResponse(200, {}, "Reminder deleted"));
  } catch (error) {
    console.log("Failed to delete Reminder", error);
    throw new ApiError(404, "Failed to delete Reminder");
  }
};

export {
  getAllReminders,
  createReminder,
  getReminderById,
  updateReminder,
  deleteReminder,
};
