/*NEW STUFF*/
const express = require("express");
const router = express.Router();


app.get('/', async (req, res) => {
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

module.exports = router;
/*END OF NEW STUFF*/