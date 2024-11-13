const nodemailer=require("nodemailer")

const transporter = nodemailer.createTransport({
    service: 'gmail',
    port: 465,
    secure: true,
    auth: {
        user: 'am.xyug@gmail.com',
        pass: 'emlzepezebstbtxg'
    }
});

function sendEmail(to, subject, text) {
    const mailOptions = {
        from: 'am.xyug@gmail.com',
        to: to,
        subject: subject,
        text: text
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Error occurred: ' + error.message);
            return console.log('Error occurred: ' + error.message);
        }
        console.log(info)
        console.log('Email sent: ' + info.response);
        return info.response
        
    });
}

module.exports.sendEmail=sendEmail