const express = require('express');
const path = require('path');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON and form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CRITICAL: This serves your HTML, CSS, and JS from the 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// Email Form Submission Endpoint (Change '/send-email' to match your form action URL if needed)
app.post('/send-email', async (req, res) => {
    const { name, email, message } = req.body;

    // Configure Nodemailer with your environment variable
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'festhondorodeo@gmail.com',
            pass: process.env.EMAIL_PASS // Pulls directly from Render's Environment Variables
        }
    });

    const mailOptions = {
        from: email,
        to: 'festhondorodeo@gmail.com',
        subject: `New submission from ${name || 'Website Visitor'}`,
        text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).send('Email sent successfully!');
    } catch (error) {
        console.error('Email sending error:', error);
        res.status(500).send('Failed to send email.');
    }
});

// Fallback to index.html for single-page apps
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});