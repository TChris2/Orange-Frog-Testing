require('dotenv').config();
const cors = require('cors');
const express = require('express');
const { userCollection } = require('./mongo');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const PORT = process.env.PORT || 8000;
const app = express();

app.use(express.json());
app.use(cors());

const adminCredentials = {
    email: process.env.ADMIN_EMAIL,
    password: process.env.ADMIN_PASSWORD
};

// Nodemailer for sending emails
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
    }
});


const generateTempPassword = () => {
    return Math.random().toString(36).slice(-8); 
};


app.post('/create-user', async (req, res) => {
    const { name, email, address, dob, allergies, extraComments } = req.body;

    if (!name || !email) {
        return res.status(400).json({ message: 'Name and Email are required' });
    }

    const tempPassword = generateTempPassword();
    console.log('Temporary password:', tempPassword);

    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    try {
        const newUser = new userCollection({
            name,
            email,
            password: hashedPassword, 
            address,
            dob,
            allergies,
            extraComments,
            temporaryPassword: true 
        });

        await newUser.save();

        await transporter.sendMail({
            from: process.env.EMAIL_USERNAME,
            to: email,
            subject: 'Your Account Has Been Created',
            text: `Hi ${name},\n\nYour account has been created. You can login with the following credentials:\n\nUsername: ${email}\nTemporary Password: ${tempPassword}\n\nPlease log in and change your password.\n\nThanks,\nAdmin`
        });

        res.status(200).json({ message: 'User created and email sent' });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ message: 'Error creating user' });
    }
});

// User login and password
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    // Check for admin login
    if (email === adminCredentials.email && password === adminCredentials.password) {
        return res.status(200).json({ message: 'Login successful, Admin', role: 'admin' });
    }

    try {
        const user = await userCollection.findOne({ email });
        if (user) {
            const isPasswordMatch = await bcrypt.compare(password, user.password);

            if (isPasswordMatch) {
                if (user.temporaryPassword) {
                    return res.status(200).json({ message: 'Temporary password, must reset', role: 'user', resetRequired: true });
                }
                return res.status(200).json({ message: 'Login successful, User', role: 'user' });
            } else {
                return res.status(401).json({ message: 'Invalid credentials' });
            }
        } else {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        return res.status(500).json({ message: 'Server error' });
    }
});

// Password reset route
app.post('/reset-password', async (req, res) => {
    const { email, tempPassword, newPassword } = req.body;

    try {
        const user = await userCollection.findOne({ email });
        if (user) {
            const isTempPasswordMatch = await bcrypt.compare(tempPassword, user.password);

            if (isTempPasswordMatch) {
                const hashedNewPassword = await bcrypt.hash(newPassword, 10);
                user.password = hashedNewPassword;
                user.temporaryPassword = false; 
                await user.save();

                return res.status(200).json({ message: 'Password reset successful' });
            } else {
                return res.status(401).json({ message: 'Temporary password does not match' });
            }
        } else {
            return res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        return res.status(500).json({ message: 'Server error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
