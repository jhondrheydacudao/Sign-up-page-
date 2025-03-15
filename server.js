const express = require("express");
const nodemailer = require("nodemailer");
const path = require("path");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(express.static(__dirname)); // Serve index.html

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Serve index.html
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

// Handle sign-up requests
app.post("/signup", async (req, res) => {
    const { username, email, password } = req.body;

    if (!email || !username || !password) {
        return res.status(400).json({ message: "All fields are required!" });
    }

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_USER, // Sends the signup info to YOU
        subject: "New User Signup",
        text: `A new user signed up:\nUsername: ${username}\nEmail: ${email}\nPassword: ${password}`
    };

    try {
        await transporter.sendMail(mailOptions);
        res.json({ message: "Signup successful! Wait for approval." });
    } catch (error) {
        console.error("Error sending email:", error);
        res.status(500).json({ message: "Error sending email." });
    }
});

app.listen(3000, () => console.log("Server running on port 3000"));
