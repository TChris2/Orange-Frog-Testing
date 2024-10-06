require('dotenv').config();
const cors = require('cors');
const express = require('express');
const { userCollection } = require('./mongo');
const PORT = process.env.PORT || 8000;
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

const defaultUser = {
    email: process.env.DEFAULT_EMAIL,  
    password: process.env.DEFAULT_PASSWORD  
};

app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (email === defaultUser.email && password === defaultUser.password) {
        return res.status(200).json({ message: 'Login successful' });
    } else {
        return res.status(401).json({ message: 'Invalid credentials' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
