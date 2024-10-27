/*NEW STUFF*/
const express = require("express");
const router = express.Router();
const bcrypt = require('bcrypt');


app.put('/', async (req, res) => {
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

module.exports = router;
/*END OF NEW STUFF*/