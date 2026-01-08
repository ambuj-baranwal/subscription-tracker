import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async (emailId, scheduleISODateTime = null) => {
  try {
    const emailConfig = {
      from: "Subscription Tracker <onboarding@resend.dev>",
      to: emailId,
      subject: "Reminder from Subscription Tracker",
      html: `<h1>Your subscription is renewing soon!</h1>`,
    };

    if (scheduleISODateTime) {
      emailConfig.scheduledAt = scheduleISODateTime;
    }

    const response = await resend.emails.send(emailConfig);

    console.log("Email Sent Successfully", response);
    return response;
  } catch (error) {
    return console.error("Error sending Email", error);
  }
};

const sendBatchEmail = async (...payload) => {
  try {
    const response = await resend.batch.send([
      {
        from: "Acme <onboarding@resend.dev>",
        to: ["foo@gmail.com"],
        subject: "hello world",
        html: "<h1>it works!</h1>",
      },
      {
        from: "Acme <onboarding@resend.dev>",
        to: ["bar@outlook.com"],
        subject: "world hello",
        html: "<p>it works!</p>",
      },
    ]);

    console.log(`Batch Email Sent Successfully : ${response}`);
  } catch (error) {
    return console.error("Error sending Batch Email", error);
  }
};

const updateEmailSchedule = async (resendIdForEmail, scheduleISODateTime) => {
  try {
    const response = await resend.emails.update({
      id: resendIdForEmail,
      scheduledAt: scheduleISODateTime,
    });

    console.log("Email schedule updated successfully:", response);
    return response;
  } catch (error) {
    return console.error("Error scheduling Email reminder", error);
  }
};

const cancelEmail = async (resendIdForEmail) => {
  try {
    return await resend.emails.cancel(resendIdForEmail);
  } catch (error) {
    return console.error("Error scheduling Email reminder", error);
  }
};

export { sendEmail, sendBatchEmail, updateEmailSchedule, cancelEmail };
