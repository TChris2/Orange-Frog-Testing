/*NEW STUFF*/
const express = require("express");
const router = express.Router();
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');

const generateTempPassword = () => {
    return Math.random().toString(36).slice(-8); 
};

// Nodemailer setup
const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    ignoreTLSVerify: true,
    auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
    }
});

// Create a new user
app.post('/', async (req, res) => {
    const { name, email } = req.body;
    const tempPassword = generateTempPassword();
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    try {
        const newUser = new userCollection({
            name,
            email,
            password: hashedPassword,
            temporaryPassword: true,
            status: 'pending' // New user is always pending at first
        });
        await newUser.save();

        // Send email to the user
       // Send email to the user
await transporter.sendMail({
    from: process.env.EMAIL_USERNAME,
    to: email,
    subject: 'Your Account Has Been Created',
    html: `<p>Hello ${name},</p><p>Your account has been created. Please use the following credentials to log in and change your password:</p><p>Email: ${email}<br>Temporary Password: ${tempPassword}</p>`
}, (error, info) => {
    if (error) {
        console.log("Error sending email: ", error);  // Log the error
    } else {
        console.log("Email sent successfully: ", info.response);  // Log success
    }
});


        res.status(200).json({ message: 'User created and email sent', user: newUser });
    } catch (error) {
        res.status(500).json({ message: 'Error creating user' });
    }
});

module.exports = router;
/*END OF NEW STUFF*/