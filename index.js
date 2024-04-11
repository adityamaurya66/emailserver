const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 }));
app.use(cors()); // Enable CORS for all routes

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    port:465,
    secure:true,
    auth: {
        user: "code2pdf11@gmail.com",
        pass: "dszidjlxubveoemw",
    }
});

app.post('/send-email', (req, res) => {
    console.log(req.body); // Log the entire request body
    const { data,name,email} = req.body.attachments[0];
    var base64Index = data.indexOf('base64');
    var extractedData = data.substring(base64Index + "base64,".length);
    const attachments = [
        {
            filename: name,
            content: extractedData,
            encoding: 'base64'
        },
    ];
    const mailOptions = {
        from: "code2pdf11@gmail.com",
        to: email,
        subject: "Your PDF Files",
        html: `
            <div style="font-family: Arial, sans-serif; background-color: #f2f2f2; padding: 20px;">
                <h1 style="color: #333;">Hey There,</h1>
                <p style="color: #666;">We hope this message finds you well.</p>
                <p style="color: #666;">We're thrilled to share that your code files have been transformed into PDF format using Code2PDF's innovative service.</p>
                <h2 style="color: #666;">Greetings! Your PDFs are ready to be explored. Have a great day!</h2>
                <p style="color: #666;">If you have any further queries or require assistance, feel free to reach out to us.</p>
                <p style="color: #666;">Best regards,</p>
                <p style="color: #666;">The Code2PDF Team</p>
            </div>
        `,
        attachments: attachments
    };
    

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Error:', error);
            res.status(500).send('Email sending failed.');
        } else {
            console.log('Email sent:', info.response);
            res.status(200).send('Email sent successfully.');
        }
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

