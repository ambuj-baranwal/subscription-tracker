import { Subscription, Reminder } from "../config/prisma.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import {asyncHandler} from "../utils/asyncHandler.js";
import {addDays} from "date-fns";

const getDashboardStats = async (req, res) => {
    try {
        const userId = req.user.id;

        const activeSubs = await Subscription.findMany({
            where: {
                userId,
                status: 'active'
            }
        });

        // 1. Calculate Total Monthly Spend (Estimate)
        // We normalize prices to a monthly basis for a "Burn Rate"
        let totalMonthlySpend = 0;

        activeSubs.forEach(sub => {
            let monthlyPrice = sub.price;
            // Simple normalization logic
            switch(sub.frequency) {
                case 'yearly': monthlyPrice = sub.price / 12; break;
                case 'halfYearly': monthlyPrice = sub.price / 6; break;
                case 'quarterly': monthlyPrice = sub.price / 3; break;
                case 'weekly': monthlyPrice = sub.price * 4; break;
                case 'daily': monthlyPrice = sub.price * 30; break;
                // cases 'monthly' and 'once' handled naturally or ignored
            }
            totalMonthlySpend += monthlyPrice;
        });

        // 2. Count Active Subscriptions
        const totalActiveSubs = activeSubs.length;

        // 3. Count Upcoming Reminders (next 7 days)
        const nextWeek = new Date();
        nextWeek.setDate(nextWeek.getDate() + 7);

        const upcomingRemindersCount = await Reminder.count({
            where: {
                userId,
                sendAt: {
                    gte: new Date(),
                    lte: nextWeek
                },
                enabled: true
            }
        });

        return res.status(200).json(
            new ApiResponse(200, {
                totalMonthlySpend: Math.round(totalMonthlySpend),
                totalActiveSubs,
                upcomingRemindersCount,
                currency: "INR" // Assuming default or taking from user prefs
            }, "Dashboard stats fetched")
        );

    } catch (error) {
        console.error("Dashboard Stats Error:", error);
        return res.status(500).json(new ApiError(500, "Failed to fetch dashboard stats"));
    }
};

/**
 * Get spending breakdown by Category (for Pie Charts)
 */
const getSpendingAnalytics = async (req, res) => {
    try {
        const userId = req.user.id;

        // Prisma GroupBy is perfect for this
        const categorySpend = await Subscription.groupBy({
            by: ['category'],
            where: {
                userId,
                status: 'active'
            },
            _sum: {
                price: true
            }
        });

        // Format for frontend charts (e.g., Recharts or Chart.js)
        // Output: [{ name: 'Entertainment', value: 500 }, ...]
        const chartData = categorySpend.map(item => ({
            name: item.category,
            value: item._sum.price || 0
        }));

        return res.status(200).json(
            new ApiResponse(200, chartData, "Spending analytics fetched")
        );

    } catch (error) {
        console.error("Analytics Error:", error);
        return res.status(500).json(new ApiError(500, "Failed to fetch analytics"));
    }
};

/**
 * Get upcoming renewals (Sorted by date)
 */
const getUpcomingRenewals = async (req, res) => {
    try {
        const userId = req.user.id;
        const limit = parseInt(req.query.limit) || 5;

        const upcoming = await Subscription.findMany({
            where: {
                userId,
                status: 'active',
                renewalDate: {
                    gte: new Date() // Only future dates
                }
            },
            orderBy: {
                renewalDate: 'asc' // Closest dates first
            },
            take: limit,
            select: {
                id: true,
                name: true,
                price: true,
                renewalDate: true,
                category: true,
            }
        });

        return res.status(200).json(
            new ApiResponse(200, upcoming, "Upcoming renewals fetched")
        );

    } catch (error) {
        console.error("Upcoming Renewals Error:", error);
        return res.status(500).json(new ApiError(500, "Failed to fetch renewals"));
    }
};

const getUpcomingReminders = asyncHandler(async (req, res) => {
    const { days = 7 } = req.query;
     const today = new Date();
    const futureDate = addDays(today, Number(7));

    const upcomingReminders = await Reminder.findMany({
        where: {
            userId: req.user.id,
            enabled: true,
            sendAt: {
                gte: today,
                lte: futureDate,
            },
        },
        orderBy: {
            sendAt: "asc",
        },
    });

    if (upcomingReminders.length < 0) {
        return res
            .status(200)
            .json(
                new ApiResponse(200, [], "No upcoming renewals found for this period"),
            );
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                upcomingReminders,
                `Found ${upcomingReminders.length} upcoming renewals`,
            ),
        );
});

export {
    getDashboardStats,
    getSpendingAnalytics,
    getUpcomingRenewals,
    getUpcomingReminders,
};