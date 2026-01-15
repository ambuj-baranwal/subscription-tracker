import { Reminder } from "../config/prisma.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { cancelEmail, sendEmail } from "../utils/sendEmail.utils.js";
import {calculateNextPaymentDate} from "../utils/dateHandler.utils.js";

const getAllReminders = async (req, res) => {
  try {
    const Id = req.user.id; // getting through auth middleware
    const reminders = await Reminder.findMany({
      where: { userId: Id },
      orderBy: { createdAt: "desc" },
    });
    if (reminders.length === 0) {
      return res
        .status(200)
        .json(new ApiResponse(400, {}, "No reminders found"));
    }

    return res
      .status(200)
      .json(new ApiResponse(200, reminders, "Fetched all reminders"));
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Failed to fetch reminders",
      error: error.message,
    });
  }
};

const createReminder = async (req, res) => {
  try {
    let {
      userId = req.user.id,
      subscriptionId,
      type = "email",
      payload,
      timezone = "UTC",
      scheduleType = "monthly",
      sendAt = "",
      cron_expr = "",
      maxAttempts = 3,
    } = req.body;

    // const dt = new Date();
    // dt.setMinutes(dt.getMinutes() + 1);
    sendAt = calculateNextPaymentDate(scheduleType);

    const reminder = await Reminder.create({
      data: {
        userId: userId,
        subscriptionId: subscriptionId,
        type: type,
        payload: payload,
        timezone: timezone,
        scheduleType: scheduleType,
        cronExpression: cron_expr || "",
        sendAt: sendAt,
        maxAttempts: maxAttempts,
      },
    });

    if (!reminder) {
      return res.status(400).json({ error: "Failed to create reminder" });
    }
    // create an email reminder
    try {
      // schedule reminder logic
      const emailReminder = await sendEmail(
        "workspacebyamb@gmail.com",
        sendAt.toISOString()
      );
      console.log(await emailReminder);
      return res
        .status(201)
        .json(
          new ApiResponse(
            201,
            { reminder, emailReminder },
            "Reminder created successfully"
          )
        );
    } catch (error) {
      console.warn("Schedule Reminder Failed after Creation: ", error);
      return res
        .status(400)
        .json(
          new ApiResponse(
            201,
            { reminder },
            "Reminder created (Email schedule failed)"
          )
        );
    }
  } catch (error) {
    console.log("Failed to create Reminder", error);
    return res.status(404).json({
      message: "Failed to create reminder",
      error: error.message,
    });
  }
};

const getReminderById = async (req, res) => {
  try {
    const Id = req.user.id;
    const { id: reminderId } = req.params;
    const reminder = await Reminder.findUnique({
      where: { id: reminderId, userId: Id },
    });

    if (!reminder) {
      return res
        .status(404)
        .json(new ApiResponse(404, {}, "No reminder found"));
    }
    return res
      .status(200)
      .json(new ApiResponse(200, reminder, "Fetched reminder"));
  } catch (error) {
    console.log("Failed to fetch reminder", error);
    return res.status(404).json({
      message: "Failed to fetch reminder",
      error: error.message,
    });
  }
};

const updateReminder = async (req, res) => {
  try {
    let {
      userId = req.user.id,
      subscriptionId,
      type = "email",
      payload,
      timezone = "UTC",
      scheduleType, // monthly, daily, weekly, yearly
      sendAt = "",
      cron_expr = "",
      maxAttempts = 3,
    } = req.body;
    const { id: reminderId } = req.params;

    sendAt = calculateNextPaymentDate(scheduleType);
    const updatedReminder = await Reminder.update({
      where: { id: reminderId, userId: userId },
      data: {
        type: type,
        payload: payload,
        timezone: timezone,
        scheduleType: scheduleType,
        cronExpression: cron_expr,
        sendAt: sendAt,
        maxAttempts: maxAttempts,
      },
    });
    return res
      .status(201)
      .json(
        new ApiResponse(201, updatedReminder, "Reminder updated successfully")
      );
  } catch (error) {
    console.log("Failed to update Reminders", error);
    return res.status(404).json({
      message: "Failed to update reminders",
      error: error.message,
    });
  }
};

const deleteReminder = async (req, res) => {
  try {
    const { id: reminderId } = req.params;
    const Id = req.user.id;
    await Reminder.delete({
      where: { id: reminderId, userId: Id },
    });
    // write logic to get id of scheduled email & cancel it
    // const res = cancelEmail()
    return res.status(204).json(new ApiResponse(204, {}, "Reminder deleted"));
  } catch (error) {
    console.log("Failed to delete Reminder", error);
    return res.status(404).json({
      message: "Failed to delete reminder",
      error: error.message,
    });
  }
};

export {
  getAllReminders,
  createReminder,
  getReminderById,
  updateReminder,
  deleteReminder,
};
