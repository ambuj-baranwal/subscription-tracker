import { Subscription } from "../config/prisma.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { calculateNextCycleDate} from "../utils/dateHandler.utils.js";

const getSubscriptions = async (req, res) => {
  try {
    const Id = req.user.id; // getting through auth middleware
    const subscriptions = await Subscription.findMany({
      where: { userId: Id },
      orderBy: { createdAt: "desc" },
    });
    if (subscriptions.length === 0) {
      return res
        .status(200)
        .json(new ApiResponse(400, {}, "No subscriptions found"));
    }

    return res
      .status(200)
      .json(new ApiResponse(200, subscriptions, "Fetched all subscriptions"));
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Failed to fetch subscriptions",
      error: error.message,
    });
  }
};

const createSubscription = async (req, res) => {
  try {
    let {
      name,
      price,
      currency,
      frequency,
      category,
      paymentMethod,
      status,
      startDate,
      renewalDate,
    } = req.body;
    const userId = req.user.id;
    const start = new Date(startDate);
    let renewal = renewalDate ? new Date(renewalDate) : calculateNextCycleDate(frequency, startDate);

    const reminderDate = new Date(renewal);
    reminderDate.setDate(reminderDate.getDate() - 1);
    // console.log(`Current DateTime : ${dt.toLocaleString("en-IN")} `)
    // console.log(`Renewal Date : ${renewalDate.toLocaleString("en-IN")}`)
    const subscription = await Subscription.create({
      data: {
        userId: userId,
        name: name,
        price: Number(price),
        currency: currency,
        frequency: frequency,
        category: category,
        paymentMethod: paymentMethod,
        status: status,
        startDate: start,
        renewalDate: renewal,
        reminders: {
            create: {
                userId: userId,
                type: 'email',
                scheduleType: frequency,
                sendAt: reminderDate,
                // status: 'pending',
                payload: {}
            }
        },
      },
    });

    return res
      .status(201)
      .json(
        new ApiResponse(201, subscription, "Subscription created successfully")
      );
  } catch (error) {
    console.log("Failed to create Subscription", error);
    return res.status(500).json({
      message: "Failed to create subscription",
      error: error.message,
    });
  }
};

const getSubscriptionById = async (req, res) => {
  try {
    const Id = req.user.id;
    const { id: subscriptionId } = req.params;
    const subscription = await Subscription.findUnique({
      where: { id: subscriptionId, userId: Id },
    });

    if (!subscription) {
      return res
        .status(404)
        .json(new ApiResponse(404, {}, "No subscription found"));
    }
    return res
      .status(200)
      .json(new ApiResponse(200, subscription, "Fetched subscription"));
  } catch (error) {
    console.log("Failed to fetch subscription", error);
    return res.status(404).json({
      message: "Failed to fetch subscription",
      error: error.message,
    });
  }
};

const updateSubscription = async (req, res) => {
  try {
    const Id = req.user.id;
    const { id: subscriptionId } = req.params;

    const updateData = req.body;
    const updatedSubscription = await Subscription.update({
      where: { id: subscriptionId, userId: Id },
      data: updateData,
    });
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          updatedSubscription,
          "Subscription updated successfully"
        )
      );
  } catch (error) {
    console.log("Failed to update Subscriptions", error);
    if (error.code === "P2025") {
      return res.status(404).json({ message: "Subscription not found" });
    }
    return res.status(500).json({
      message: "Failed to update subscriptions",
      error: error.message,
    });
  }
};

const deleteSubscription = async (req, res) => {
  try {
    const { id: subscriptionId } = req.params;
    const Id = req.user.id;
    await Subscription.delete({
      where: { id: subscriptionId, userId: Id },
    });
    return res
      .status(204)
      .json(new ApiResponse(204, {}, "Subscription deleted"));
  } catch (error) {
    console.log("Failed to delete Subscription", error);
    return res.status(404).json({
      message: "Failed to delete subscription",
      error: error.message,
    });
  }
};

const deleteAllSubscriptions = async (req, res) => {
  try {
    // const subscriptionId = req.params
    const Id = req.user.id;
    await Subscription.deleteMany({
      where: { userId: Id },
    });
    return res
      .status(204)
      .json(new ApiResponse(204, {}, "Subscription deleted"));
  } catch (error) {
    console.log("Failed to delete All Subscription", error);
    return res.status(404).json({
      message: "Failed to delete all subscription",
      error: error.message,
    });
  }
};

export {
  getSubscriptions,
  createSubscription,
  getSubscriptionById,
  updateSubscription,
  deleteSubscription,
  deleteAllSubscriptions,
};
