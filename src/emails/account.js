const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'danielabdi12@live.nl',
        subject: 'Welcome to the Task Manager App!',
        text: `Thank you for using the Task Manager, ${name}. Let me know how you get along with the app.`
    })
}

const sendCancelEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'danielabdi12@live.nl',
        subject: `Dear ${name}, It's sad to see you go!`,
        text: `Thanks for using the Task Manager. What could we have done to improve the service? We would appreciate it if you would let us know!`
    })
}

module.exports = {
    sendWelcomeEmail,
    sendCancelEmail
}