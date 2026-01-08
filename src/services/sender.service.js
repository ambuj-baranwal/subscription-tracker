import nodemailer from 'nodemailer';


const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: false,
    auth: process.env.SMTP_USER ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } : undefined
});

const sendReminder = async (reminder) => {
    if (reminder.type === 'email') {
        const p = reminder.payload;
        if (!p?.to) throw new Error('Invalid payload: missing to');
        await transporter.sendMail({
            from: process.env.MAIL_FROM || 'no-reply@yourapp.example',
            to: p.to,
            subject: p.subject || 'Reminder',
            text: p.text,
            html: p.html
        });
        return {};
    }
    // ✅ TODO: implement push/SMS transports
}

export {
    sendReminder,
}