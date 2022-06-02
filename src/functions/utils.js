const nodemailer = require('nodemailer');


const sendEmail = async(recEmailAddress, daysAmount = 0) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.systemEmailAddress,
            pass: process.env.systemEmailPassword
        }
    });

    const mailOptions = {
        from: 'no-reply@hilik-bot.io',
        to: recEmailAddress,
        subject: '[Hilik] -> mission completed',
        text: `Hi there 👋 It’s Hilik, your Hilan have been filled up with ${daysAmount} days.  See you next month!`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

module.exports = { sendEmail }