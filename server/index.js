require('dotenv').config();
const cors = require('cors');
const express = require('express');
const { userCollection, eventCollection } = require('./mongo');
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

const generateTempPassword = () => {
    return Math.random().toString(36).slice(-8); 
};

// Fetch users (pending and active)
app.get('/users', async (req, res) => {
    try {
        const users = await userCollection.find();
        res.status(200).json(users); // Return all users, status included
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users' });
    }
});

// Create a new user
app.post('/create-user', async (req, res) => {
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

// User login and password reset flow
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    // Admin login check
    if (email === adminCredentials.email && password === adminCredentials.password) {
        return res.status(200).json({ message: 'Login successful, Admin', role: 'admin' });
    }

    try {
        const user = await userCollection.findOne({ email });
        if (user) {
            const isPasswordMatch = await bcrypt.compare(password, user.password);

            if (isPasswordMatch) {
                // If the user has reset the password, bypass temporary password checks
                if (user.temporaryPassword) {
                    return res.status(200).json({ message: 'Temporary password, must reset', role: 'user', resetRequired: true });
                }

                // If profile is incomplete (status is pending), redirect to complete profile page
                if (user.status === 'pending') {
                    return res.status(200).json({ message: 'Profile incomplete, must complete', role: 'user', completeProfile: true });
                }

                // Login successful with the new password
                return res.status(200).json({ message: 'Login successful', role: 'user' });
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



// Complete profile route
app.post('/complete-profile', async (req, res) => {
    const { email, address, dob, allergies, phone, height, gender } = req.body;

    console.log("Request Body:", req.body); // Log to see the incoming data

    try {
        const user = await userCollection.findOne({ email: email.trim() });
        if (!user) {
            console.error("User not found for email:", email); // Log when user is not found
            return res.status(404).json({ message: 'User not found' });
        }

        // Update user fields
        user.address = address;
        user.dob = dob;
        user.allergies = Array.isArray(allergies) ? allergies : []; // Ensure allergies is an array
        user.phone = phone;
        
        // If height is an object, update fields; otherwise, log an error.
        if (height && typeof height === 'object') {
            user.height = {
                feet: parseInt(height.feet) || 0,
                inches: parseInt(height.inches) || 0
            };
        } else {
            console.error("Invalid height format:", height);
        }

        user.gender = gender;
        user.status = 'active';

        await user.save();
        console.log("User profile updated successfully for:", email); // Log success
        return res.status(200).json({ message: 'Profile completed successfully' });
    } catch (error) {
        console.error("Error during profile completion:", error); // Log the error details
        return res.status(500).json({ message: 'Server error' });
    }
});



// Delete user
app.delete('/delete-user/:id', async (req, res) => {
    try {
        await userCollection.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting user' });
    }
});

app.get('/user-profile/:email', async (req, res) => {
    const { email } = req.params;
    try {
        const user = await userCollection.findOne({ email });
        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

app.put('/update-profile/:email', async (req, res) => {
    const { email } = req.params;
    const { name, address, dob, allergies, password } = req.body;

    try {
        const user = await userCollection.findOne({ email });
        if (user) {
            user.name = name || user.name;
            user.address = address || user.address;
            user.dob = dob || user.dob;
            user.allergies = allergies || user.allergies;

            if (password) {
                const hashedPassword = await bcrypt.hash(password, 10);
                user.password = hashedPassword;
            }

            await user.save();
            res.status(200).json({ message: 'Profile updated successfully' });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

app.post('/create-event', async (req, res) => {
    const { eventName, eventLoadIn, eventLoadOut, eventLocation, eventHours, eventDescription } = req.body;
    if (!eventName || !eventLoadIn || !eventLoadOut || !eventLocation) {
        return res.status(400).json({ message: 'Event Name, Date, and Location are required' });
    }
    try {
        const newEvent = new eventCollection({
            eventName,
            eventLoadIn,
            eventLoadOut,
            eventLocation,
            eventHours, 
            eventDescription
        });
    
        await newEvent.save();
        res.status(200).json({ message: 'Event created successfully' });
    } catch (error) {
        console.error('Error creating event:', error);
        res.status(500).json({ message: 'Error creating event' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});



